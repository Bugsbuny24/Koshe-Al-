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
    supabase = create_client(SUPABASE_URL,
