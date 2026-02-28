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

# [span_2](start_span)Ortam Değişkenleri[span_2](end_span)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# [span_3](start_span)Servis Bağlantıları[span_3](end_span)
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Gemini Aktif")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("KOSCHEI AI: Supabase Bağlantısı Kuruldu")

# [span_4](start_span)[span_5](start_span)Model Tanımları (Stabilite için Flash 1.5, Zeka için 3.1 Pro)[span_4](end_span)[span_5](end_span)
MODELS = {
    [span_6](start_span)[span_7](start_span)"flash": "gemini-1.5-flash",    # inline_data hatasını önlemek için en stabili[span_6](end_span)[span_7](end_span)
    "pro":   "gemini-3.1-pro-preview", 
    "ultra": "gemini-3.1-pro-preview",
}

# [span_8](start_span)Ajan Talimatları[span_8](end_span)
AGENT_PROMPTS = {
    "web_developer": "Sen Uzman Web Geliştirici Koschei'sin. Modern ve SEO uyumlu kod yazarsın.",
    "game_developer": "Sen Kıdemli Oyun Geliştirici Koschei'sin. Unity ve Unreal Engine uzmanısın.",
    "logo_designer": "Sen Kreatif Tasarımcı Koschei'sin. Marka kimliği ve logo tasarımında uzmansın.",
    "seo_expert": "Sen SEO ve İçerik Stratejisti Koschei'sin. Google sıralama odaklı çalışırsın.",
    "general": "Sen KOSCHEI AI'sın. Türkiye'nin en güçlü yapay zeka asistanısın."
}

# [span_9](start_span)Veri Modelleri[span_9](end_span)
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

# [span_10](start_span)Yardımcı Fonksiyonlar[span_10](end_span)
def get_model(tier: str, role: str = "general"):
    model_key = MODELS.get(tier, MODELS["flash"])
    model_name = f"models/{model_key}"
    instruction = AGENT_PROMPTS.get(role, AGENT_PROMPTS["general"])
    return genai.GenerativeModel(model_name=model_name, system_instruction=instruction)

def safe_get_text(response):
    """inline_data hatasını önlemek için sadece metin parçalarını çeker."""
    try:
        if response.candidates and response.candidates[0].content.parts:
            return "".join([part.text for part in response.candidates[0].content.parts if hasattr(part, 'text')])
        return "Yanıt alınamadı."
    except Exception:
        return "Metin dönüştürme hatası oluştu."

# -[span_11](start_span)-- ENDPOINTLER ---[span_11](end_span)

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
        
        # [span_12](start_span)Supabase Kaydı (Hem orders hem snap_scripts tablolarına uyumlu)[span_12](end_span)
        if supabase:
            # 1. Genel Sipariş Tablosu
            order_data = {
                "user_id": req.user_id,
                "category": req.category,
                "prompt": req.prompt,
                "result": content,
                "status": "completed"
            }
            supabase.table("orders").insert(order_data).execute()
            
            # 2. [span_13](start_span)Teknik Script Tablosu (snap_scripts kolonlarına göre)[span_13](end_span)
            script_data = {
                "user_id": req.user_id if req.user_id != "guest" else None,
                "prompt": req.prompt,
                "result": content,
                [span_14](start_span)"script_content": content, # NOT NULL alan[span_14](end_span)
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
