import base64
import uvicorn
from PIL import Image
from io import BytesIO
from fastapi import FastAPI
from utils import analyze_image
from contextlib import asynccontextmanager
from constants import SERVER_URL, PORT, ENV
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class ImageData(BaseModel):
    image: str
    dict_of_vars: dict

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def root():
    return {"message": "Server is running"}

@app.post('/calculate')
async def run(data: ImageData):
    image_data = base64.b64decode(data.image.split(",")[1])
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
    data = []
    for response in responses:
        data.append(response)
    print('response in route: ', response)
    return {"message": "Image processed", "data": data, "status": "success"}


if __name__ == "__main__":
    uvicorn.run("server:app", host=SERVER_URL, port=int(PORT), reload=(ENV == "dev"))