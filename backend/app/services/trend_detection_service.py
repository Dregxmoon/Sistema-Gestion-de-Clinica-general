from collections import Counter
from datetime import datetime, timezone

from app.repositories.consultas_repository import ConsultasRepository
from app.schemas.alerts import AlertaEvolucionPatologica


class TrendDetectionService:
    def __init__(self, repository: ConsultasRepository):
        self.repository = repository

    def detectar_hiper_frecuentacion(self, paciente_id: int, threshold_x: int, window_days_y: int, related_symptoms: list[int]) -> AlertaEvolucionPatologica | None:
        rows = self.repository.get_related_visits(
            paciente_id=paciente_id,
            related_symptoms=related_symptoms,
            window_days=window_days_y,
        )
        visitas_unicas = {row[0].id_consulta for row in rows}
        if len(visitas_unicas) <= threshold_x:
            return None

        categorias = sorted({row[2].categoria for row in rows})
        symptom_counter = Counter([row[1].id_sintoma for row in rows])
        recurrentes = [symptom_id for symptom_id, count in symptom_counter.items() if count >= 2]

        if len(visitas_unicas) >= threshold_x + 3:
            nivel = "critica"
        elif len(visitas_unicas) >= threshold_x + 1:
            nivel = "atencion"
        else:
            nivel = "observacion"

        return AlertaEvolucionPatologica(
            paciente_id=paciente_id,
            total_visitas_relacionadas=len(visitas_unicas),
            ventana_dias=window_days_y,
            umbral_visitas=threshold_x,
            categorias_detectadas=categorias,
            sintomas_recurrentes=sorted(recurrentes),
            nivel_alerta=nivel,
            timestamp_utc=datetime.now(timezone.utc),
        )
