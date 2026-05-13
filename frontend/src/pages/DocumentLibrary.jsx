import { useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../services/api';
import { Trash2, FileText, Loader2, Calendar, Database } from 'lucide-react';

const DocumentLibrary = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const { data } = await getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(id);
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete document');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-cyan mb-4">
            <Database size={14} />
            <span>Repository</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Document Library</h1>
          <p className="text-text-secondary">Manage and organize all indexed corporate knowledge</p>
        </div>
        <div className="glass-panel text-primary-light text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
          <FileText size={16} />
          <span>{documents.length} File{documents.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl">
          <div className="w-20 h-20 bg-surface border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No documents yet</h3>
          <p className="text-text-secondary mb-6">Upload some files to start building your knowledge base.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, idx) => (
            <div 
              key={doc.id} 
              className="glass-card rounded-2xl p-6 relative group overflow-hidden"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl text-primary-light">
                  <FileText size={24} />
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-text-muted hover:text-red-400 bg-surface border border-transparent hover:border-red-400/20 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                  title="Delete Document"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-white truncate mb-2 pr-2" title={doc.filename}>
                {doc.filename}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-text-muted mt-4">
                <Calendar size={14} />
                {new Date(doc.upload_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
