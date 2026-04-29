from datetime import datetime, date

from pydantic import BaseModel


class PacienteResumen(BaseModel):
    id_paciente: int
    nombre_completo: str
    fecha_nacimiento: date
    genero: str
    estado: str


class SintomaCatalogoItem(BaseModel):
    id_sintoma: int
    nombre_sintoma: str
    categoria: str
    nivel_riesgo_base: int


class ConsultaSintomaItem(BaseModel):
    id_sintoma: int
    nombre_sintoma: str
    categoria: str
    intensidad: str
    duracion_dias: int | None


class ConsultaDetalle(BaseModel):
    id_consulta: int
    fecha_consulta: datetime
    motivo: str | None
    temperatura: float | None
    frecuencia_cardiaca: int | None
    saturacion_oxigeno: float | None
    sintomas: list[ConsultaSintomaItem]


class PacienteExpediente(BaseModel):
    paciente: PacienteResumen
    consultas: list[ConsultaDetalle]
