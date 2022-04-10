from fastapi import APIRouter, Request, Depends
from fastapi_server_session import Session

from .db_connector import DBProcessor, CONN_STRING
from .main import session_manager

router = APIRouter(prefix="/auth")
db = DBProcessor(CONN_STRING)

@router.post("/login/")
async def validate_login(cred: Request, session: Session = Depends(session_manager.use_session)):
    data = await cred.json()
    if db.check_if_user_exists(data['login'], data['password']):
        session["name"] = data['login']
        return {"status": True}
    else: 
        return {"status": False}

@router.post("/registration/")
async def validate_login(cred: Request):
    data = await cred.json()
    res = db.add_new_user(data['login'], data['password'])
    return {"status": res}

@router.post("/logout/")
async def validate_login(cred: Request, session: Session = Depends(session_manager.use_session)):
    session["name"] = None
    return {"status": True}