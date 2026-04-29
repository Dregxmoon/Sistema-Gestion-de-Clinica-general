from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SistemaMedico API"
    env: str = "production"
    database_url: str = "mssql+pyodbc://sa:YourStrong!Passw0rd@localhost/SistemaMedico?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
    alert_window_days: int = 30
    alert_visit_threshold: int = 3

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
