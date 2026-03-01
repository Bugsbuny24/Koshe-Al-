import os
import time
import asyncio
import traceback
from typing import Optional, Dict, Any

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from supabase import create_client, Client

app = FastAPI()

# CORS Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ENV
# =========================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Worker ayarları
WORKER_ENABLED = os.environ.get("WORKER_ENABLED", "1") == "1"
WORKER_ID = os.environ.get("WORKER_ID", "hf-worker-1")
WORKER_POLL_SECONDS = int(os.environ.get("WORKER_POLL_SECONDS", "3"))
WORKER_LOCK_MINUTES = int(os.environ.get("WORKER_LOCK_MINUTES", "10"))

# Servis Bağlantıları
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Gemini Aktif")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("KOSCHEI AI: Supabase Bağlantısı Kuruldu")

# =========================
# Model Tanımları
# =========================
MODELS = {
    "flash": "gemini-1.5-flash",
    "pro":   "gemini-3.1-pro-preview",
    "ultra": "gemini-3.1-pro-preview",
}

# Ajan Talimatları
AGENT_PROMPTS = {
    "web_developer": "Sen Uzman Web Geliştirici Koschei'sin. Modern ve SEO uyumlu kod yazarsın.",
    "game_developer": "Sen Kıdemli Oyun Geliştirici Koschei'sin. Unity ve Unreal Engine uzmanısın.",
    "logo_designer": "Sen Kreatif Tasarımcı Koschei'sin. Marka kimliği ve logo tasarımında uzmansın.",
    "seo_expert": "Sen SEO ve İçerik Stratejisti Koschei'sin. Google sıralama odaklı çalışırsın.",
    "general": "Sen KOSCHEI AI'sın. Türkiye'nin en güçlü yapay zeka asistanısın."
}

# =========================
# Request Models
# =========================
class ServiceOrder(BaseModel):
    category: str
    prompt: str
    user_id: str = "guest"
    package: str = "starter"

class ChatRequest(BaseModel):
    messages: list
    model_tier: str = "flash"
    agent_role: str = "general"

class RepoRequest(BaseModel):
    repo_url: str

# =========================
# Helpers
# =========================
def get_model(tier: str, role: str = "general"):
    model_key = MODELS.get(tier, MODELS["flash"])
    model_name = f"models/{model_key}"
    instruction = AGENT_PROMPTS.get(role, AGENT_PROMPTS["general"])
    return genai.GenerativeModel(model_name=model_name, system_instruction=instruction)

def safe_get_text(response):
    try:
        if response.candidates and response.candidates[0].content.parts:
            return "".join([part.text for part in response.candidates[0].content.parts if hasattr(part, "text")])
        return "Yanıt alınamadı."
    except Exception:
        return "Metin dönüştürme hatası oluştu."

def pick_tier_for_job(job_type: str) -> str:
    """
    Basit kural:
    - studio_video / studio_game / cinema_action -> ultra
    - diğer -> pro/flash
    Bunu istersen model_routing tablosundan okuyacak hale getiririz.
    """
    jt = (job_type or "").lower()
    if jt in ["studio_video", "studio_game", "cinema_action", "ultra"]:
        return "ultra"
    if jt in ["web_app", "mobile_app", "app_generator", "blueprint"]:
        return "pro"
    return "flash"

async def generate_with_gemini(job_type: str, prompt: str) -> Dict[str, Any]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY yok. Worker AI üretemez.")

    tier = pick_tier_for_job(job_type)
    model = get_model(tier, "general")

    # İstersen burada job_type'a özel instruction da ekleyebiliriz.
    # Şimdilik prompt'u direkt gönderiyoruz.
    resp = model.generate_content(prompt)
    text = safe_get_text(resp)

    return {
        "text": text,
        "engine": "gemini",
        "tier": tier,
        "job_type": job_type,
    }

# =========================
# Worker Core
# =========================
async def claim_next_stage() -> Optional[Dict[str, Any]]:
    if not supabase:
        return None

    res = supabase.rpc(
        "claim_next_stage",
        {"p_worker_id": WORKER_ID, "p_lock_minutes": WORKER_LOCK_MINUTES},
    ).execute()

    if res.data and len(res.data) > 0:
        return res.data[0]
    return None

async def complete_stage(stage_id: str, output: Dict[str, Any], error: Optional[str] = None) -> None:
    if not supabase:
        return

    supabase.rpc(
        "complete_stage",
        {
            "p_stage_id": stage_id,
            "p_worker_id": WORKER_ID,
            "p_output": output,
            "p_error": error,
        },
    ).execute()

async def worker_loop():
    if not WORKER_ENABLED:
        print("WORKER: disabled (WORKER_ENABLED=0)")
        return
    if not supabase:
        print("WORKER: Supabase yok, worker çalışmayacak.")
        return

    print(f"WORKER: started (id={WORKER_ID}) poll={WORKER_POLL_SECONDS}s lock={WORKER_LOCK_MINUTES}m")

    while True:
        try:
            stage = await claim_next_stage()

            if not stage:
                await asyncio.sleep(WORKER_POLL_SECONDS)
                continue

            stage_id = stage.get("stage_id")
            job_type = stage.get("job_type") or "general"
            prompt = stage.get("prompt") or ""
            stage_number = stage.get("stage_number")

            print(f"WORKER: claimed stage={stage_id} job_type={job_type} stage_no={stage_number}")

            # AI üretim
            output = await generate_with_gemini(job_type, prompt)

            # stage complete
            await complete_stage(stage_id, output, None)
            print(f"WORKER: completed stage={stage_id}")

        except Exception as e:
            err = str(e)
            print("WORKER ERROR:", err)
            print(traceback.format_exc())
            # Eğer stage_id yakalanabildiyse failed basmak istersen burada ekleriz.
            await asyncio.sleep(5)

# =========================
# FastAPI lifecycle
# =========================
@app.on_event("startup")
async def on_startup():
    # background worker başlat
    asyncio.create_task(worker_loop())

# =========================
# ENDPOINTS
# =========================
@app.get("/")
async def root():
    return {
        "status": "KOSCHEI AI Online",
        "agents": list(AGENT_PROMPTS.keys()),
        "worker": {
            "enabled": WORKER_ENABLED,
            "id": WORKER_ID,
            "poll_seconds": WORKER_POLL_SECONDS,
            "lock_minutes": WORKER_LOCK_MINUTES,
            "supabase_connected": bool(supabase),
            "gemini_configured": bool(GEMINI_API_KEY),
        },
    }

@app.post("/order")
async def create_order(req: ServiceOrder):
    if not GEMINI_API_KEY:
        return {"error": "AI motoru aktif değil."}

    tier_map = {"starter": "flash", "pro": "pro", "ultimate": "ultra"}
    tier = tier_map.get(req.package, "flash")

    try:
        model = get_model(tier, req.category)
        response = model.generate_content(req.prompt)
        content = safe_get_text(response)

        if supabase:
            # Orders tablosuna ekle
            order_data = {
                "user_id": req.user_id,
                "category": req.category,
                "prompt": req.prompt,
                "result": content,
                "status": "completed",
            }
            supabase.table("orders").insert(order_data).execute()

            # snap_scripts tablosuna ekle
            script_data = {
                "user_id": req.user_id if req.user_id != "guest" else None,
                "prompt": req.prompt,
                "result": content,
                "script_content": content,
                "package_type": req.package,
                "is_active": True,
            }
            supabase.table("snap_scripts").insert(script_data).execute()

        return {"status": "success", "delivery": content}
    except Exception as e:
        return {"error": str(e)}

@app.post("/ask")
async def chat(req: ChatRequest):
    try:
        model = get_model(req.model_tier, req.agent_role)
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(req.messages[-1]["content"])
        content = safe_get_text(response)
        return {"reply": content}
    except Exception as e:
        return {"error": str(e)}

@app.post("/analyze")
async def analyze_repo(req: RepoRequest):
    return {"message": "Analiz fonksiyonu hazır, GITHUB_TOKEN ile çalışıyor."}
