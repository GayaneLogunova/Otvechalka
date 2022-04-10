from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="../frontend/build")

@router.get("/")
async def serve_spa(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@router.get("/registration")
async def register(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@router.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@router.get("/library")
async def show_library(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@router.get("/add_book")
async def add_file(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@router.get("/answer")
async def show_answer(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })