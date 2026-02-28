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
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("KOSCHEI AI: Gemini aktif")
else:
    print("HATA: GEMINI_API_KEY bulunamadi!")

MODELS = {
    "flash": "gemini-3.0-flash",
    "pro":   "gemini-2.5-flash",
    "ultra": "gemini-3.1-pro",
}

SYSTEM_PROMPT = """Sen KOSCHEI AI'sın. Türkiye'nin en güçlü AI servis platformusun.

Kod üretirken:
- Her dosyayı ```filepath:dosya/yolu şeklinde başlat
- Production-ready, çalışan kod yaz
- TODO bırakma, tüm fonksiyonları implement et
- Türkçe yorum satırları ekle
- README.md de ekle

GitHub analizi yaparken:
- Tech stack'i detaylı belirt
- Eksik dosyaları listele
- Güvenlik risklerini belirt
- Tamamlanma yüzdesi ver

Her zaman Türkçe yanıt ver. Direkt ve teknik ol."""


class ChatRequest(BaseModel):
    messages: list
    model_tier: str = "flash"


class RepoRequest(BaseModel):
    repo_url: str


class CodeRequest(BaseModel):
    prompt: str
    package: str = "starter"


def get_model(tier: str):
    model_name = MODELS.get(tier, MODELS["flash"])
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=SYSTEM_PROMPT
    )


def parse_github_url(url: str):
    url = url.strip().rstrip("/")
    if "github.com" in url:
        parts = url.split("github.com/")[-1].split("/")
        if len(parts) >= 2:
            return parts[0], parts[1]
    return None, None


async def get_repo_tree(owner: str, repo: str) -> dict:
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    async with httpx.AsyncClient(timeout=15) as client:
        repo_res = await client.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers)
        repo_data = repo_res.json()
        branch = repo_data.get("default_branch", "main")
        tree_res = await client.get(f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1", headers=headers)
        tree_data = tree_res.json()
        deps_content = ""
        for file_info in tree_data.get("tree", []):
            if file_info.get("path") in ["package.json", "requirements.txt", "Cargo.toml", "go.mod"] and file_info.get("type") == "blob":
                file_res = await client.get(f"https://api.github.com/repos/{owner}/{repo}/contents/{file_info['path']}", headers=headers)
                file_data = file_res.json()
                if "content" in file_data:
                    content = base64.b64decode(file_data["content"]).decode("utf-8", errors="ignore")
                    deps_content += f"\n=== {file_info['path']} ===\n{content[:2000]}\n"
                break
        files = [f["path"] for f in tree_data.get("tree", []) if f.get("type") == "blob"]
        return {
            "name": repo_data.get("name"), "description": repo_data.get("description"),
            "language": repo_data.get("language"), "stars": repo_data.get("stargazers_count"),
            "files": files[:100], "total_files": len(files), "deps_content": deps_content
        }


@app.get("/")
async def root():
    return {
        "status": "KOSCHEI AI Online",
        "models": {"starter": "Gemini 3.0 Flash", "pro": "Gemini 2.5 Flash", "ultimate": "Gemini 3.1 Pro"},
        "features": ["code_generate", "repo_analyze", "chat"]
    }


@app.post("/generate")
async def generate_code(req: CodeRequest):
    if not GEMINI_API_KEY:
        return {"error": "AI motoru başlatılamadı."}
    tier_map = {"starter": "flash", "pro": "pro", "ultimate": "ultra"}
    token_map = {"starter": 4000, "pro": 16000, "ultimate": 64000}
    tier = tier_map.get(req.package, "flash")
    try:
        model = get_model(tier)
        response = model.generate_content(
            req.prompt,
            generation_config=genai.GenerationConfig(temperature=0.1, max_output_tokens=token_map.get(req.package, 4000))
        )
        return {"result": response.text, "model": MODELS.get(tier), "package": req.package}
    except Exception as e:
        return {"error": f"Kod üretilemedi: {str(e)}"}


@app.post("/analyze")
async def analyze_repo(req: RepoRequest):
    if not GEMINI_API_KEY:
        return {"error": "AI motoru başlatılamadı."}
    owner, repo = parse_github_url(req.repo_url)
    if not owner:
        return {"error": "Geçersiz GitHub URL."}
    try:
        repo_data = await get_repo_tree(owner, repo)
    except Exception as e:
        return {"error": f"Repo okunamadı: {str(e)}"}
    prompt = f"""Bu GitHub reposunu analiz et:
Repo: {repo_data['name']} | Dil: {repo_data['language']} | Dosya: {repo_data['total_files']}
Dosyalar: {chr(10).join(repo_data['files'])}
Bağımlılıklar: {repo_data['deps_content']}
Tech stack, eksik dosyalar, güvenlik riskleri, öneriler, tamamlanma yüzdesi ver."""
    try:
        model = get_model("flash")
        response = model.generate_content(prompt, generation_config=genai.GenerationConfig(temperature=0.0, max_output_tokens=4000))
        return {"repo": repo_data["name"], "owner": owner, "analysis": response.text, "file_count": repo_data["total_files"], "language": repo_data["language"]}
    except Exception as e:
        return {"error": f"AI hatası: {str(e)}"}


@app.post("/ask")
async def chat_endpoint(request: ChatRequest):
    if not GEMINI_API_KEY:
        return {"reply": "AI motoru başlatılamadı."}
    try:
        model = get_model(request.model_tier or "flash")
        history = [{"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]} for m in request.messages[:-1]]
        chat = model.start_chat(history=history)
        last = request.messages[-1]["content"] if request.messages else ""
        response = chat.send_message(last, generation_config=genai.GenerationConfig(temperature=0.2, max_output_tokens=8000))
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Hata: {str(e)}"}
