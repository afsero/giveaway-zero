from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import bot, game, health, model
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        description="Mock-first API skeleton for GiveawayZero.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(game.router, prefix="/api/game", tags=["game"])
    app.include_router(bot.router, prefix="/api/bot", tags=["bot"])
    app.include_router(model.router, prefix="/api/model", tags=["model"])

    return app


app = create_app()
