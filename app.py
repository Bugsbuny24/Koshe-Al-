import os
import asyncio
import traceback
from typing import Optional, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from supabase import create_client, Client

app = FastAPI()

# =========================
# CORS
# =========================
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

# =========================
# Service Connections
# =========================
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Gemini Aktif", flush=True)
else:
    print("KOSCHEI AI: Gemini PASIF (GEMINI_API_KEY yok)", flush=True)

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("KOSCHEI AI: Supabase Bağlantısı Kuruldu", flush=True)
else:
    print("KOSCHEI AI: Supabase PASIF (URL/KEY yok)", flush=True)

# =========================
# Model Registry
# =========================
MODELS = {
    "flash": "gemini-1.5-flash",
    "pro": "gemini-3.1-pro-preview",
    "ultra": "gemini-3.1-pro-preview",
}

# Ajan Talimatları
AGENT_PROMPTS = {
    "web_developer": "Sen Uzman Web Geliştirici Koschei'sin. Modern ve SEO uyumlu kod yazarsın.",
    "game_developer": "Sen Kıdemli Oyun Geliştirici Koschei'sin. Unity ve Unreal Engine uzmanısın.",
    "logo_designer": "Sen Kreatif Tasarımcı Koschei'sin. Marka kimliği ve logo tasarımında uzmansın.",
    "seo_expert": "Sen SEO ve İçerik Stratejisti Koschei'sin. Google sıralama odaklı çalışırsın.",
    "general": "Sen KOSCHEI AI'sın. Türkiye'nin en güçlü yapay zeka asistanısın.",
}

# =========================
# Request Models
# =========================
class ServiceOrder(BaseModel):
    category: str
    prompt: str
    user_id: str
    job_type: str = "general"          # örn: studio_video, general
    estimated_credits: float = 3       # UI bunu kategoriye göre set edebilir
    is_studio: bool = False
    ultra_required: bool = False
    ultra_daily_limit: int = 0
    metadata: Dict[str, Any] = Field(default_factory=dict)

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

def safe_get_text(response) -> str:
    try:
        if response.candidates and response.candidates[0].content.parts:
            return "".join(
                [part.text for part in response.candidates[0].content.parts if hasattr(part, "text")]
            )
        return "Yanıt alınamadı."
    except Exception:
        return "Metin dönüştürme hatası oluştu."

def db_get_routing(category: str) -> Dict[str, str]:
    """
    model_routing tablosundan category için primary/fallback tier çeker.
    Yoksa flash/flash döner.
    """
    routing = {"primary_tier": "flash", "fallback_tier": "flash"}
    if not supabase or not category:
        return routing
    try:
        r = (
            supabase.table("model_routing")
            .select("primary_tier,fallback_tier")
            .eq("category", category)
            .limit(1)
            .execute()
        )
        if r.data and len(r.data) > 0:
            routing.update(r.data[0])
    except Exception as e:
        print(f"WORKER: routing read failed category={category} err={e}", flush=True)
    return routing

async def generate_with_gemini(category: str, job_type: str, prompt: str) -> Dict[str, Any]:
    """
    DB routing -> primary tier ile dener.
    Fail olursa fallback tier ile 1 kere daha dener.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY yok. Worker AI üretemez.")

    routing = db_get_routing(category)
    primary = routing.get("primary_tier", "flash")
    fallback = routing.get("fallback_tier", "flash")

    # 1) primary dene
    try:
        model = get_model(primary, "general")
        resp = model.generate_content(prompt)
        text = safe_get_text(resp)
        return {
            "text": text,
            "engine": "gemini",
            "tier": primary,
            "job_type": job_type,
            "category": category,
        }
    except Exception as e1:
        # 2) fallback dene
        print(f"WORKER: primary failed tier={primary} -> fallback={fallback} err={e1}", flush=True)
        model = get_model(fallback, "general")
        resp = model.generate_content(prompt)
        text = safe_get_text(resp)
        return {
            "text": text,
            "engine": "gemini",
            "tier": fallback,
            "job_type": job_type,
            "category": category,
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
        print("WORKER: disabled (WORKER_ENABLED=0)", flush=True)
        return
    if not supabase:
        print("WORKER: Supabase yok, worker çalışmayacak.", flush=True)
        return

    print(
        f"WORKER: started (id={WORKER_ID}) poll={WORKER_POLL_SECONDS}s lock={WORKER_LOCK_MINUTES}m",
        flush=True,
    )

    while True:
        stage_id = None
        try:
            stage = await claim_next_stage()

            if not stage:
                await asyncio.sleep(WORKER_POLL_SECONDS)
                continue

            stage_id = stage.get("stage_id")
            job_type = stage.get("job_type") or "general"
            category = stage.get("category") or "general"
            prompt = stage.get("prompt") or ""
            stage_number = stage.get("stage_number")

            print(
                f"WORKER: claimed stage={stage_id} category={category} job_type={job_type} stage_no={stage_number}",
                flush=True,
            )

            output = await generate_with_gemini(category, job_type, prompt)

            await complete_stage(stage_id, output, None)
            print(f"WORKER: completed stage={stage_id} tier={output.get('tier')}", flush=True)

        except Exception as e:
            err = str(e)
            print("WORKER ERROR:", err, flush=True)
            print(traceback.format_exc(), flush=True)

            # stage kilitlenmesin -> failed bas
            try:
                if stage_id:
                    await complete_stage(stage_id, {"engine": "worker", "note": "failed"}, err)
                    print(f"WORKER: marked failed stage={stage_id}", flush=True)
            except Exception as e2:
                print("WORKER ERROR (mark failed):", str(e2), flush=True)

            await asyncio.sleep(5)

# =========================
# FastAPI lifecycle
# =========================
@app.on_event("startup")
async def on_startup():
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
    """
    TEK doğru akış:
    create_job_and_spend -> orders + job_stages oluşur, worker tamamlar.
    """
    if not supabase:
        return {"error": "Supabase bağlı değil."}

    try:
        res = supabase.rpc(
            "create_job_and_spend",
            {
                "p_user_id": req.user_id,
                "p_job_type": req.job_type,
                "p_category": req.category,
                "p_prompt": req.prompt,
                "p_estimated_credits": req.estimated_credits,
                "p_is_studio": req.is_studio,
                "p_ultra_required": req.ultra_required,
                "p_ultra_daily_limit": req.ultra_daily_limit,
                "p_metadata": req.metadata,
            },
        ).execute()

        if not res.data:
            return {"error": "create_job_and_spend boş döndü."}

        job = res.data[0]
        order_id = job.get("id") or job.get("job_id") or job.get("order_id")

        return {
            "status": "queued",
            "order_id": order_id,
            "category": req.category,
            "job_type": req.job_type,
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/order/{order_id}")
async def get_order(order_id: str):
    """
    UI/Pi Browser polling için.
    """
    if not supabase:
        return {"error": "Supabase bağlı değil."}

    try:
        r = (
            supabase.table("orders")
            .select("id,created_at,category,job_type,status,result,credits_spent,credits_total,model_route,updated_at")
            .eq("id", order_id)
            .limit(1)
            .execute()
        )
        if not r.data:
            return {"error": "Order bulunamadı."}
        return r.data[0]
    except Exception as e:
        return {"error": str(e)}

@app.post("/ask")
async def chat(req: ChatRequest):
    """
    Basit chatbot endpoint. (Pipeline'dan bağımsız)
    """
    try:
        if not GEMINI_API_KEY:
            return {"error": "AI motoru aktif değil."}

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
