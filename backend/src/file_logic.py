from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from starlette.responses import FileResponse
from fastapi_server_session import Session
from pydantic import BaseModel
from tika import parser

import os
import subprocess
from typing import List, Optional
from .neural_network_connector import NeuralNetwork, PATH

from .main import session_manager

router = APIRouter(prefix="/file")
neuralNetwork = NeuralNetwork(PATH)

class PublicFilename(BaseModel):
    filename: str
    publisher: str

class PrivateFilename(BaseModel):
    filename: str

@router.post("/upload")
async def upload(user_name: str = Form(...), public_files: Optional[List[UploadFile]] = File(None), private_files: Optional[List[UploadFile]] = File(None)):
    not_valid_files = []
    
    async def valid_short_files(filepath, file):
        pdf_filepath = '{}.pdf'.format(filepath.rsplit('.', 1)[0])
        text = parser.from_file(pdf_filepath)['content']
        if not text or len(text) < 500:
            not_valid_files.append(file)
            os.remove(pdf_filepath)

    async def write_files(file, file_path, out_path):
        if not os.path.exists(file_path):
            os.mknod(file_path)

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        if '.pdf' not in file_path:
            subprocess.run(['libreoffice', '--headless', '--convert-to', 'pdf', file_path, '--outdir', out_path])
            os.remove(file_path)

    if public_files:
        for file in public_files:
            file_name_parts = file.filename.rsplit('.', 1)
            file_path = 'library/public/{}__{}__.{}'.format(file_name_parts[0], user_name, file_name_parts[1])
            out_path = 'library/public/'
            
            await write_files(file, file_path, out_path)
            await valid_short_files(file_path, file) 
            
    if private_files:
        for file in private_files:
            file_path = 'library/private/{}/{}'.format(user_name, file.filename)
            out_path = 'library/private/{}/'.format(user_name)

            if not os.path.exists('library/private/%s'%user_name):
                os.makedirs('library/private/%s'%user_name)

            await write_files(file, file_path, out_path)
            await valid_short_files(file_path, file)

    if len(not_valid_files) > 0:
        return not_valid_files
    return True

@router.get("/get_all_public", response_model=List[PublicFilename])
async def send_all_public_files():
    filenames = os.listdir("library/public")
    parsedData = []
    for filename in filenames:
        filename_parts = filename.rsplit('__', 2)
        parsedData.append({ "filename": "{}{}".format(filename_parts[0], filename_parts[2]), "publisher": filename_parts[1] })
    
    return parsedData

@router.get("/get_all_private", response_model=List[PrivateFilename])
async def send_all_private_files(username: str):
    filenames = os.listdir("library/private/{}".format(username))
    parsedData = []
    for filename in filenames:
        parsedData.append({ "filename": filename })
    
    return parsedData

@router.get("/get_public/{filename}")
async def send_public_file(filename):
    return FileResponse("library/public/{}".format(filename), media_type='application/pdf',filename=filename)

@router.get("/get_private/{username}/{filename}")
async def send_private_file(username, filename, session: Session = Depends(session_manager.use_session)): #
    print(1)
    if session["name"] == username:
        return FileResponse("library/private/{}/{}".format(username, filename), media_type='application/pdf',filename=filename)
    else:
        raise HTTPException(status_code=400, detail="Доступ запрещен")