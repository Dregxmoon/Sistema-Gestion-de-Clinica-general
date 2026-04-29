from datetime import datetime, timedelta

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.clinical import Consulta, ConsultaSintoma, PatronRiesgo, SintomaCatalogo


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
