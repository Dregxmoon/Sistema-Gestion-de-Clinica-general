from datetime import datetime, timedelta

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.clinical import Consulta, ConsultaSintoma, Paciente, PatronRiesgo, SintomaCatalogo


class ConsultasRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_related_visits(self, paciente_id: int, related_symptoms: list[int], window_days: int) -> list[tuple[Consulta, ConsultaSintoma, SintomaCatalogo]]:
        since = datetime.utcnow() - timedelta(days=window_days)
        stmt: Select = (
            select(Consulta, ConsultaSintoma, SintomaCatalogo)
            .join(ConsultaSintoma, ConsultaSintoma.id_consulta == Consulta.id_consulta)
            .join(SintomaCatalogo, SintomaCatalogo.id_sintoma == ConsultaSintoma.id_sintoma)
            .where(
                Consulta.id_paciente == paciente_id,
                Consulta.fecha_consulta >= since,
                ConsultaSintoma.id_sintoma.in_(related_symptoms),
            )
        )
        return list(self.db.execute(stmt).all())

    def get_patrones_riesgo(self) -> list[PatronRiesgo]:
        stmt: Select = select(PatronRiesgo)
        return list(self.db.scalars(stmt).all())

    def list_pacientes(self, limit: int = 100) -> list[Paciente]:
        stmt: Select = select(Paciente).order_by(Paciente.id_paciente.desc()).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get_paciente(self, paciente_id: int) -> Paciente | None:
        stmt: Select = select(Paciente).where(Paciente.id_paciente == paciente_id)
        return self.db.scalars(stmt).first()

    def list_sintomas_catalogo(self, categoria: str | None = None, limit: int = 300) -> list[SintomaCatalogo]:
        stmt: Select = select(SintomaCatalogo)
        if categoria:
            stmt = stmt.where(SintomaCatalogo.categoria == categoria)
        stmt = stmt.order_by(SintomaCatalogo.categoria, SintomaCatalogo.nombre_sintoma).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get_consultas_con_sintomas(self, paciente_id: int, window_days: int = 180) -> list[tuple[Consulta, ConsultaSintoma, SintomaCatalogo]]:
        since = datetime.utcnow() - timedelta(days=window_days)
        stmt: Select = (
            select(Consulta, ConsultaSintoma, SintomaCatalogo)
            .join(ConsultaSintoma, ConsultaSintoma.id_consulta == Consulta.id_consulta)
            .join(SintomaCatalogo, SintomaCatalogo.id_sintoma == ConsultaSintoma.id_sintoma)
            .where(Consulta.id_paciente == paciente_id, Consulta.fecha_consulta >= since)
            .order_by(Consulta.fecha_consulta.desc(), Consulta.id_consulta.desc())
        )
        return list(self.db.execute(stmt).all())
