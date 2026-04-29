from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id_paciente: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100))
    apellido: Mapped[str] = mapped_column(String(100))

    consultas: Mapped[list["Consulta"]] = relationship(back_populates="paciente")


class Consulta(Base):
    __tablename__ = "consultas"

    id_consulta: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_paciente: Mapped[int] = mapped_column(ForeignKey("pacientes.id_paciente"), index=True)
    fecha_consulta: Mapped[datetime] = mapped_column(DateTime)

    paciente: Mapped[Paciente] = relationship(back_populates="consultas")
    sintomas: Mapped[list["ConsultaSintoma"]] = relationship(back_populates="consulta")


class ConsultaSintoma(Base):
    __tablename__ = "consulta_sintomas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_consulta: Mapped[int] = mapped_column(ForeignKey("consultas.id_consulta"), index=True)
    id_sintoma: Mapped[int] = mapped_column(ForeignKey("sintomas_catalogo.id_sintoma"), index=True)
    intensidad: Mapped[str] = mapped_column(String(10), default="leve")

    consulta: Mapped[Consulta] = relationship(back_populates="sintomas")


class SintomaCatalogo(Base):
    __tablename__ = "sintomas_catalogo"

    id_sintoma: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre_sintoma: Mapped[str] = mapped_column(String(100))
    categoria: Mapped[str] = mapped_column(String(50))


class PatronRiesgo(Base):
    __tablename__ = "patrones_riesgo"

    id_patron: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre_patron: Mapped[str] = mapped_column(String(100))
    sintomas_ids: Mapped[str] = mapped_column(String(500))
    frecuencia_umbral: Mapped[int] = mapped_column(Integer)
    ventana_dias: Mapped[int] = mapped_column(Integer)
    enfermedad_probable: Mapped[str] = mapped_column(String(100))
    nivel_alerta: Mapped[str] = mapped_column(String(15))
