from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.consultas_repository import ConsultasRepository
from app.schemas.alerts import AlertRequest
from app.schemas.alerts import PredictiveResponse
from app.services.trend_detection_service import TrendDetectionService

router = APIRouter(prefix="/api/v1/alertas", tags=["alertas"])


@router.post("/evolucion-patologica")
def detectar_alerta_patologica(payload: AlertRequest, db: Session = Depends(get_db)):
    try:
        service = TrendDetectionService(ConsultasRepository(db))
        alerta = service.detectar_hiper_frecuentacion(
            paciente_id=payload.paciente_id,
            threshold_x=payload.threshold_x,
            window_days_y=payload.window_days_y,
            related_symptoms=payload.related_symptoms,
        )

        return {
            "alerta_generada": alerta is not None,
            "alerta": alerta.model_dump() if alerta else None,
        }
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No fue posible consultar el historial clínico en este momento.",
        ) from exc


@router.get("/predictiva/{paciente_id}", response_model=PredictiveResponse)
def detectar_alerta_predictiva(paciente_id: int, db: Session = Depends(get_db)):
    try:
        service = TrendDetectionService(ConsultasRepository(db))
        alertas = service.detectar_alertas_predictivas(paciente_id=paciente_id)
        return PredictiveResponse(paciente_id=paciente_id, alertas=alertas)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No fue posible ejecutar el análisis predictivo.",
        ) from exc
