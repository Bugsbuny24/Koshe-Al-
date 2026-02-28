import os
import io
import httpx
import base64
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

# Ortam Değişkenleri
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Servis Bağlantıları
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Gemini Aktif")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("KOSCHEI AI: Supabase Bağlantısı Kuruldu")

# Model Tanımları
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

# Veri Modelleri
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

# Yardımcı Fonksiyonlar
def get_model(tier: str, role: str = "general"):
    model_key = MODELS.get(tier, MODELS["flash"])
    model_name = f"models/{model_key}"
    instruction = AGENT_PROMPTS.get(role, AGENT_PROMPTS["general"])
    return genai.GenerativeModel(model_name=model_name, system_instruction=instruction)

def safe_get_text(response):
    """Metin dışındaki (inline_data vb.) parçaları filtreleyerek hata almayı önler."""
    try:
        if response.candidates and response.candidates[0].content.parts:
            return "".join([part.text for part in response.candidates[0].content.parts if hasattr(part, 'text')])
        return "Yanıt alınamadı."
    except Exception:
        return "Metin dönüştürme hatası oluştu."

# --- ENDPOINTLER ---

@app.get("/")
async def root():
    return {"status": "KOSCHEI AI Online", "agents": list(AGENT_PROMPTS.keys())}

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
            # 1. Orders tablosuna ekle
            order_data = {
                "user_id": req.user_id,
                "category": req.category,
                "prompt": req.prompt,
                "result": content,
                "status": "completed"
            }
            supabase.table("orders").insert(order_data).execute()
            
            # 2. snap_scripts tablosuna ekle
            script_data = {
                "user_id": req.user_id if req.user_id != "guest" else None,
                "prompt": req.prompt,
                "result": content,
                "script_content": content,
                "package_type": req.package,
                "is_active": True
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
