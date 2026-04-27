import os
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize models
# We use a lightweight model for semantic search
try:
    semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Failed to load sentence transformer: {e}")
    semantic_model = None

class SearchEngine:
    def __init__(self):
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.documents = []  # List of dicts: {'id': doc_id, 'filename': name, 'content': text}
        self.chunks = []     # List of dicts: {'doc_id': doc_id, 'filename': name, 'chunk': text}
        self.tfidf_matrix = None
        self.chunk_embeddings = None
        self.needs_reindex = True

    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list:
        """Split text into rough chunks using simple character slicing for speed."""
        # A more advanced chunker would use spaCy or NLTK for sentence boundaries.
        text = re.sub(r'\s+', ' ', text).strip()
        chunks = []
        start = 0
        while start < len(text):
            chunks.append(text[start:start+chunk_size])
            start += (chunk_size - overlap)
        return chunks

    def load_documents(self, db_docs):
        """Loads documents from DB models into the search engine."""
        self.documents = [{'id': d.id, 'filename': d.filename, 'content': d.content} for d in db_docs]
        self.chunks = []
        for doc in self.documents:
            doc_chunks = self._chunk_text(doc['content'])
            for chunk in doc_chunks:
                self.chunks.append({
                    'doc_id': doc['id'],
                    'filename': doc['filename'],
                    'chunk': chunk
                })
        self.needs_reindex = True

    def build_index(self):
        if not self.chunks:
            return
        
        chunk_texts = [c['chunk'] for c in self.chunks]
        
        # Keyword index
        try:
            self.tfidf_matrix = self.tfidf.fit_transform(chunk_texts)
        except ValueError:
            # Handles empty vocabulary
            self.tfidf_matrix = None
            
        # Semantic index
        if semantic_model:
            self.chunk_embeddings = semantic_model.encode(chunk_texts, convert_to_tensor=False)
            
        self.needs_reindex = False

    def keyword_search(self, query: str, top_k: int = 5) -> list:
        if self.needs_reindex or not self.chunks or self.tfidf_matrix is None:
            return []
        
        try:
            query_vec = self.tfidf.transform([query])
        except Exception:
            return []
            
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = sims.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if sims[idx] > 0:
                results.append({
                    **self.chunks[idx],
                    'score': float(sims[idx]),
                    'type': 'keyword'
                })
        return results

    def semantic_search(self, query: str, top_k: int = 5) -> list:
        if self.needs_reindex or not self.chunks or not semantic_model or self.chunk_embeddings is None:
            return []
            
        query_embedding = semantic_model.encode([query], convert_to_tensor=False)
        sims = cosine_similarity(query_embedding, self.chunk_embeddings).flatten()
        top_indices = sims.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if sims[idx] > 0.1: # simple threshold
                results.append({
                    **self.chunks[idx],
                    'score': float(sims[idx]),
                    'type': 'semantic'
                })
        return results

    def ask_question(self, question: str) -> dict:
        """Finds the most semantically relevant snippet for question answering."""
        results = self.semantic_search(question, top_k=1)
        if results:
            return {
                'answer': results[0]['chunk'],
                'source': results[0]['filename'],
                'score': results[0]['score']
            }
        return {
            'answer': "I'm sorry, I couldn't find an answer to that question in the available documents.",
            'source': None,
            'score': 0.0
        }

# Global singleton
search_engine = SearchEngine()
