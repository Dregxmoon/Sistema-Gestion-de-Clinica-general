from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.consultas_repository import ConsultasRepository
from app.schemas.alerts import AlertRequest, PredictiveResponse
from app.schemas.clinical import ConsultaDetalle, ConsultaSintomaItem, PacienteExpediente, PacienteResumen, SintomaCatalogoItem
from app.services.trend_detection_service import TrendDetectionService

router = APIRouter(prefix="/api/v1", tags=["alertas", "clinico"])


@router.post("/alertas/evolucion-patologica")
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


@router.get("/alertas/predictiva/{paciente_id}", response_model=PredictiveResponse)
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


@router.get("/pacientes", response_model=list[PacienteResumen])
def listar_pacientes(limit: int = Query(default=100, ge=1, le=500), db: Session = Depends(get_db)):
    repo = ConsultasRepository(db)
    pacientes = repo.list_pacientes(limit=limit)
    return [
        PacienteResumen(
            id_paciente=p.id_paciente,
            nombre_completo=f"{p.nombre} {p.apellido}",
            fecha_nacimiento=p.fecha_nacimiento,
            genero=p.genero,
            estado=p.estado,
        )
        for p in pacientes
    ]


@router.get("/sintomas", response_model=list[SintomaCatalogoItem])
def listar_sintomas(categoria: str | None = None, limit: int = Query(default=300, ge=1, le=1000), db: Session = Depends(get_db)):
    repo = ConsultasRepository(db)
    sintomas = repo.list_sintomas_catalogo(categoria=categoria, limit=limit)
    return [SintomaCatalogoItem.model_validate(s) for s in sintomas]


@router.get("/expediente/{paciente_id}", response_model=PacienteExpediente)
def obtener_expediente_paciente(paciente_id: int, window_days: int = Query(default=180, ge=30, le=3650), db: Session = Depends(get_db)):
    repo = ConsultasRepository(db)
    paciente = repo.get_paciente(paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    rows = repo.get_consultas_con_sintomas(paciente_id=paciente_id, window_days=window_days)
    por_consulta: dict[int, dict] = defaultdict(lambda: {"consulta": None, "sintomas": []})

    for consulta, cs, sintoma in rows:
        por_consulta[consulta.id_consulta]["consulta"] = consulta
        por_consulta[consulta.id_consulta]["sintomas"].append(
            ConsultaSintomaItem(
                id_sintoma=cs.id_sintoma,
                nombre_sintoma=sintoma.nombre_sintoma,
                categoria=sintoma.categoria,
                intensidad=cs.intensidad,
                duracion_dias=cs.duracion_dias,
            )
        )

    consultas = []
    for value in por_consulta.values():
        c = value["consulta"]
        consultas.append(
            ConsultaDetalle(
                id_consulta=c.id_consulta,
                fecha_consulta=c.fecha_consulta,
                motivo=c.motivo,
                temperatura=float(c.temperatura) if c.temperatura is not None else None,
                frecuencia_cardiaca=c.frecuencia_cardiaca,
                saturacion_oxigeno=float(c.saturacion_oxigeno) if c.saturacion_oxigeno is not None else None,
                sintomas=value["sintomas"],
            )
        )

    return PacienteExpediente(
        paciente=PacienteResumen(
            id_paciente=paciente.id_paciente,
            nombre_completo=f"{paciente.nombre} {paciente.apellido}",
            fecha_nacimiento=paciente.fecha_nacimiento,
            genero=paciente.genero,
            estado=paciente.estado,
        ),
        consultas=consultas,
    )
