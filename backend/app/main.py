from fastapi import FastAPI

from app.api.alerts import router as alerts_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)
app.include_router(alerts_router)


@app.get("/health")
def health():
    return {"status": "ok"}
