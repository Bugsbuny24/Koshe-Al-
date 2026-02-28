import os
import io
import httpx
import base64
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Freelancer Sistemi Aktif")
else:
    print("HATA: GEMINI_API_KEY bulunamadi!")

# Fiverr Kategorilerine Göre Model Eşleşmeleri
MODELS = {
    "flash": "gemini-3.0-flash",    # Hızlı işler (Çeviri, SEO, Chat)
    "pro":   "gemini-2.5-flash",    # Orta seviye (Web Dev, Makale)
    "ultra": "gemini-3.1-pro",      # En ağır işler (Oyun Dev, Kompleks Mimari)
    "image": "imagen-3",            # Logo ve Grafik Tasarım (API yetkisine bağlı)
}

# --- AJAN SİSTEMİ: Her Freelancer'ın Kendi Uzmanlık Talimatı ---
AGENT_PROMPTS = {
    "web_developer": """Sen Uzman Web Geliştirici Koschei'sin. Modern, responsive ve SEO uyumlu web siteleri kurarsın.
    - HTML/CSS/JS/React/Next.js konularında uzmansın.
    - Sadece kod değil, kullanıcı deneyimi (UX) tavsiyeleri de verirsin.
    - Tüm kodları kopyala-yapıştır yapmaya hazır (Production-ready) sunarsın.""",
    
    "game_developer": """Sen Kıdemli Oyun Geliştirici Koschei'sin. Unity, Unreal Engine ve Godot projelerinde uzmansın.
    - Oyun mekanikleri, fizik sistemleri ve C#/C++ kodları yazarsın.
    - Oyunun matematiksel dengesini (Game Balancing) de hesaplarsın.""",
    
    "logo_designer": """Sen Kreatif Tasarımcı Koschei'sin. Marka kimliği ve logo tasarımında uzmansın.
    - Kullanıcıya sadece görsel değil, logonun anlamını ve renk paletini de açıklarsın.
    - Görsel üretimi için en kaliteli promptları hazırlarsın.""",
    
    "music_producer": """Sen Müzik Prodüktörü Koschei'sin. Reklam müzikleri, jingle ve beat üretiminde uzmansın.
    - Nota bilgisine ve ses mühendisliği terimlerine hakimsin.""",
    
    "video_editor": """Sen Video Prodüksiyon Uzmanı Koschei'sin. Kısa videolar, YouTube içerikleri ve montaj planlamasında uzmansın."""
}

class ServiceRequest(BaseModel):
    category: str  # web_developer, logo_designer, game_developer vb.
    prompt: str
    package: str = "starter" # starter, pro, ultimate

class ChatRequest(BaseModel):
    messages: list
    model_tier: str = "flash"
    agent_role: str = "general"

def get_agent_model(tier: str, role: str):
    model_name = MODELS.get(tier, MODELS["flash"])
    # Ajanın kimliğini sistem talimatı olarak yüklüyoruz
    instruction = AGENT_PROMPTS.get(role, "Sen KOSCHEI AI'sın. Türkiye'nin en güçlü yapay zekasısın.")
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=instruction
    )

@app.get("/")
async def status():
    return {
        "status": "KOSCHEI AI Freelancer Hub Online",
        "available_agents": list(AGENT_PROMPTS.keys())
    }

@app.post("/order") # Fiverr'daki "Sipariş Ver" mantığı
async def create_service_order(req: ServiceRequest):
    if not GEMINI_API_KEY:
        return {"error": "Sistem şu an meşgul."}
    
    tier_map = {"starter": "flash", "pro": "pro", "ultimate": "ultra"}
    tier = tier_map.get(req.package, "flash")
    
    try:
        # 1. Uzman Ajanı Çağır
        model = get_agent_model(tier, req.category)
        
        # 2. İsteğe Göre Özel Üretim Yap
        response = model.generate_content(req.prompt)
        
        return {
            "order_id": "KSCH-12345",
            "category": req.category,
            "delivered_content": response.text,
            "delivery_by": "Koschei AI Agent"
        }
    except Exception as e:
        return {"error": f"Sipariş işlenemedi: {str(e)}"}

# Mevcut Chat ve Analiz endpointlerini de koruyoruz...
