from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi_server_session import SessionManager, RedisSessionInterface

import redis

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_manager = SessionManager(
    interface=RedisSessionInterface(redis.from_url("redis://localhost"))
)
session = Depends(session_manager.use_session)

from .question_answer import router as question_answer_router
from .auth import router as registration_router
from .file_logic import router as file_router
from .view import router as view_router

app.include_router(question_answer_router)
app.include_router(registration_router)
app.include_router(file_router)
app.include_router(view_router)

app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
favicon_path = '../frontend/build/favicon.ico'

@app.get('/favicon.ico')
async def favicon():
    return FileResponse(favicon_path)