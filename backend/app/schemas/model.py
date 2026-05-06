from pydantic import BaseModel


class ModelStatusResponse(BaseModel):
    model_name: str
    variant: str
    engine_mode: str
    model_loaded: bool
