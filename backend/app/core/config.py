from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SistemaMedico API"
    env: str = "production"
    database_url: str = ""
    db_auto_discovery_enabled: bool = True
    db_auto_hosts: str = r"localhost,127.0.0.1,.\SQLEXPRESS"
    db_auto_databases: str = "SistemaMedico"
    db_auto_try_trusted: bool = True
    db_auto_usernames: str = "sa"
    db_auto_passwords: str = "YourStrong!Passw0rd"
    alert_window_days: int = 30
    alert_visit_threshold: int = 3

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
