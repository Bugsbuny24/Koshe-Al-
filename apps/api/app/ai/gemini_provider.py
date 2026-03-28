import json
import structlog
import httpx
from app.ai.base_provider import BaseLLMProvider
from app.ai.schemas import FullAdGenOutput
from app.ai.prompts import build_generation_prompt
from app.ai.mock_data import get_mock_output
from app.models.campaign import CampaignBrief
from app.config import settings

logger = structlog.get_logger()


class GeminiProvider(BaseLLMProvider):
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
    MODEL = "gemini-1.5-flash"

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def generate_ads(self, brief: CampaignBrief) -> FullAdGenOutput:
        if not self.api_key:
            logger.info("No GEMINI_API_KEY set, using mock data")
            return get_mock_output(brief)

        prompt = build_generation_prompt(brief)
        result = await self._call_api(prompt)

        if result is None:
            logger.warning("Gemini API call failed, falling back to mock data")
            return get_mock_output(brief)

        return result

    async def _call_api(self, prompt: str, retry: bool = True) -> FullAdGenOutput | None:
        url = f"{self.BASE_URL}/{self.MODEL}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.8,
                "maxOutputTokens": 8192,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()

            text = data["candidates"][0]["content"]["parts"][0]["text"]
            text = text.strip()
            if text.startswith("```"):
                text = text.split("```", 2)[1]
                if text.startswith("json"):
                    text = text[4:]
            if text.endswith("```"):
                text = text.rsplit("```", 1)[0]
            text = text.strip()

            parsed = json.loads(text)
            return FullAdGenOutput.model_validate(parsed)

        except json.JSONDecodeError as e:
            logger.warning("Failed to parse Gemini JSON response", error=str(e))
            if retry:
                logger.info("Retrying Gemini API call")
                return await self._call_api(prompt, retry=False)
            return None
        except Exception as e:
            logger.error("Gemini API call failed", error=str(e))
            return None
