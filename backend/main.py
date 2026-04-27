from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil
from typing import List
from pydantic import BaseModel

from database import get_db, engine, Base
from models import Document
from document_processor import extract_text
from search import SearchEngine

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Corporate Knowledge Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's for local dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize global search engine instance
search_engine = SearchEngine()

@app.on_event("startup")
def startup_event():
    # Load all documents into search engine on startup
    db = next(get_db())
    docs = db.query(Document).all()
    search_engine.load_documents(docs)
    search_engine.build_index()

class SearchResponse(BaseModel):
    results: list
    message: str

class AskResponse(BaseModel):
    answer: str
    source: str | None
    score: float

@app.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        content = extract_text(file_path, file.filename)
        if not content:
            raise HTTPException(status_code=400, detail="Could not extract text from the document.")
            
        # Check if already exists
        existing_doc = db.query(Document).filter(Document.filename == file.filename).first()
        if existing_doc:
            existing_doc.content = content
        else:
            new_doc = Document(filename=file.filename, content=content)
            db.add(new_doc)
            
        db.commit()
        
        # Reload index
        docs = db.query(Document).all()
        search_engine.load_documents(docs)
        search_engine.build_index()
        
        return {"filename": file.filename, "status": "Uploaded and indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search", response_model=SearchResponse)
def search_documents(q: str, db: Session = Depends(get_db)):
    if not search_engine.chunks:
        return {"results": [], "message": "No documents available to search."}
        
    keyword_res = search_engine.keyword_search(q, top_k=5)
    
    # Return sorted by score
    sorted_res = sorted(keyword_res, key=lambda x: x['score'], reverse=True)
    return {"results": sorted_res[:5], "message": "Success"}

@app.get("/ask", response_model=AskResponse)
def ask_question(q: str, db: Session = Depends(get_db)):
    if not search_engine.chunks:
        return {"answer": "No documents available. Please upload some files first.", "source": None, "score": 0.0}
    
    answer_data = search_engine.ask_question(q)
    return answer_data

@app.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    return [{"id": d.id, "filename": d.filename, "upload_date": d.upload_date} for d in docs]

@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    db.delete(doc)
    db.commit()
    
    # Delete from storage
    file_path = os.path.join(UPLOAD_DIR, doc.filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        
    # Reindex
    docs = db.query(Document).all()
    search_engine.load_documents(docs)
    search_engine.build_index()
    
    return {"status": "Deleted successfully"}
