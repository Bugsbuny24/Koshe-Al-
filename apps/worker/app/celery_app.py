from celery import Celery
from celery.schedules import crontab
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "adgenius",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.generation_tasks",
        "app.tasks.campaign_optimizer",
        "app.tasks.fraud_detector",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "app.tasks.generation_tasks.run_generation_job": {"queue": "default"},
        "app.tasks.campaign_optimizer.optimize_all_campaigns": {"queue": "default"},
        "app.tasks.fraud_detector.detect_fraud": {"queue": "default"},
    },
    beat_schedule={
        "optimize-campaigns-every-15-minutes": {
            "task": "app.tasks.campaign_optimizer.optimize_all_campaigns",
            "schedule": crontab(minute="*/15"),
        },
        "detect-fraud-every-10-minutes": {
            "task": "app.tasks.fraud_detector.detect_fraud",
            "schedule": crontab(minute="*/10"),
        },
    },
)
