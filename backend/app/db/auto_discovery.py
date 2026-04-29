from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import quote_plus

from sqlalchemy import create_engine, text

from app.core.config import settings


@dataclass(frozen=True)
class SqlServerCandidate:
    host: str
    database: str
    driver: str
    trusted: bool
    username: str | None = None
    password: str | None = None

    def to_url(self) -> str:
        encoded_driver = quote_plus(self.driver)

        if self.trusted:
            return (
                f"mssql+pyodbc://@{self.host}/{self.database}?"
                f"driver={encoded_driver}&Trusted_Connection=yes&TrustServerCertificate=yes"
            )

        if self.username and self.password:
            return (
                f"mssql+pyodbc://{quote_plus(self.username)}:{quote_plus(self.password)}"
                f"@{self.host}/{self.database}?driver={encoded_driver}&TrustServerCertificate=yes"
            )

        return ""


def _split_csv(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def _read_installed_sql_server_drivers() -> list[str]:
    try:
        import pyodbc

        drivers = [d for d in pyodbc.drivers() if "SQL Server" in d]
        if drivers:
            return list(reversed(drivers))
    except Exception:
        pass

    return [
        "ODBC Driver 18 for SQL Server",
        "ODBC Driver 17 for SQL Server",
        "SQL Server",
    ]


def _build_candidates() -> list[SqlServerCandidate]:
    hosts = _split_csv(settings.db_auto_hosts)
    databases = _split_csv(settings.db_auto_databases)
    usernames = _split_csv(settings.db_auto_usernames)
    passwords = _split_csv(settings.db_auto_passwords)
    drivers = _read_installed_sql_server_drivers()

    candidates: list[SqlServerCandidate] = []

    if settings.db_auto_try_trusted:
        for host in hosts:
            for database in databases:
                for driver in drivers:
                    candidates.append(
                        SqlServerCandidate(host=host, database=database, driver=driver, trusted=True)
                    )

    if usernames and passwords:
        for host in hosts:
            for database in databases:
                for driver in drivers:
                    for username in usernames:
                        for password in passwords:
                            candidates.append(
                                SqlServerCandidate(
                                    host=host,
                                    database=database,
                                    driver=driver,
                                    trusted=False,
                                    username=username,
                                    password=password,
                                )
                            )

    return candidates


def _can_connect(database_url: str) -> bool:
    if not database_url:
        return False

    try:
        engine = create_engine(database_url, pool_pre_ping=True, future=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine.dispose()
        return True
    except Exception:
        return False


def resolve_database_url() -> str:
    explicit_url = (settings.database_url or "").strip()
    if explicit_url:
        return explicit_url

    if not settings.db_auto_discovery_enabled:
        raise RuntimeError(
            "DATABASE_URL no está configurada y la autodetección está deshabilitada. "
            "Configura DATABASE_URL o habilita DB_AUTO_DISCOVERY_ENABLED."
        )

    for candidate in _build_candidates():
        candidate_url = candidate.to_url()
        if _can_connect(candidate_url):
            return candidate_url

    raise RuntimeError(
        "No se pudo autodetectar SQL Server local. "
        "Verifica que SQL Server esté activo y que la base exista (estructura.sql + datos.sql)."
    )
