from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class NuevoIngresoClinico(BaseModel):
    id_paciente: int
    fecha_consulta: datetime
    sintomas_ids: list[int] = Field(min_length=1)


class AlertaEvolucionPatologica(BaseModel):
    paciente_id: int
    total_visitas_relacionadas: int
    ventana_dias: int
    umbral_visitas: int
    categorias_detectadas: list[str]
    sintomas_recurrentes: list[int]
    nivel_alerta: str
    timestamp_utc: datetime


class AlertRequest(BaseModel):
    paciente_id: int
    threshold_x: int = Field(default=3, ge=2, le=20)
    window_days_y: int = Field(default=30, ge=7, le=365)
    related_symptoms: list[int] = Field(min_length=1)

    @field_validator("related_symptoms")
    @classmethod
    def unique_symptoms(cls, values: list[int]) -> list[int]:
        if len(set(values)) != len(values):
            raise ValueError("related_symptoms contiene IDs duplicados")
        return values


class AlertaPredictiva(BaseModel):
    patron_id: int
    nombre_patron: str
    enfermedad_probable: str
    nivel_alerta: str
    coincidencias: int


class PredictiveResponse(BaseModel):
    paciente_id: int
    alertas: list[AlertaPredictiva]
