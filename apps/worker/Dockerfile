FROM python:3.12-slim
WORKDIR /app
COPY ../api/pyproject.toml .
RUN pip install --no-cache-dir .
COPY ../api/ .
CMD ["celery", "-A", "app.tasks.celery_app", "worker", "--loglevel=info", "-Q", "default"]
