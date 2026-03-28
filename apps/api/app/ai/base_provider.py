from abc import ABC, abstractmethod
from app.ai.schemas import FullAdGenOutput
from app.models.campaign import CampaignBrief


class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_ads(self, brief: CampaignBrief) -> FullAdGenOutput:
        """Generate ads from a campaign brief."""
        ...
