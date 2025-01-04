from typing import Union
from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
from resume_parser import extract_text, extract_data_from_text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, replace "*" with specific domains for stricter control
    allow_credentials=True,  # Allow cookies and other credentials
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)


UPLOAD_DIR = "data/resumes"

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    print(f"file_path => {file_path}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        resume_text = extract_text(file_path)
        extracted_data = extract_data_from_text(resume_text)
        return {"status": "success", "data": extracted_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
