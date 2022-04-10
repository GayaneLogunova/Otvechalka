from fastapi import APIRouter, Request, Depends
from fastapi_server_session import Session
from tika import parser

from .neural_network_connector import NeuralNetwork, PATH
# from .file_logic import neuralNetwork
# from .main import session_manager

router = APIRouter(prefix="/question")
neuralNetwork = NeuralNetwork(PATH)

@router.post("/send")
async def validate_login(cred: Request):
    data = await cred.json()
    print("data", data['question'], data['filename'])
    neuralNetwork.load_text(parser.from_file("library/{}".format(data['filename']))['content'])
    print("context", neuralNetwork.get_context())
    answer = neuralNetwork.get_answer(data['question'])

    print('answer', answer)
    return { "answer": answer }
