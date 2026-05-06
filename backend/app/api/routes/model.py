from fastapi import APIRouter

from app.schemas.model import ModelStatusResponse

router = APIRouter()


@router.get("/status", response_model=ModelStatusResponse)
def model_status() -> ModelStatusResponse:
    return ModelStatusResponse(
        model_name="RandomBot v0.0",
        variant="Giveaway / Antichess",
        engine_mode="Placeholder",
        model_loaded=False,
    )
