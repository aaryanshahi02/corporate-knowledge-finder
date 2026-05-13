import { useState } from 'react';
import { UploadCloud, File as FileIcon, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { uploadFile } from '../services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus({ type: '', message: '' });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await uploadFile(file);
      setStatus({ type: 'success', message: 'Document uploaded and indexed successfully!' });
      setFile(null); // Reset
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to upload document. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-cyan mb-6">
          <Sparkles size={14} className="animate-pulse" />
          <span>Expand Knowledge Base</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Upload Knowledge</h1>
        <p className="text-text-secondary">Supported formats: PDF, DOCX, TXT. Secure and instant indexing.</p>
      </div>

      <div 
        className={`mt-8 border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative overflow-hidden group ${
          isDragOver 
            ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
            : 'border-white/20 glass-panel hover:border-primary/50 hover:bg-surface-light/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          isDragOver ? 'bg-primary text-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-surface border border-white/10 text-text-muted group-hover:text-primary-light group-hover:scale-105'
        }`}>
          <UploadCloud className="h-10 w-10" />
        </div>
        
        <div className="flex flex-col sm:flex-row text-sm text-text-secondary justify-center items-center gap-2 relative z-10">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer font-semibold text-primary-light hover:text-white transition-colors"
          >
            <span>Click to upload</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
          </label>
          <p>or drag and drop directly here</p>
        </div>
        <p className="text-xs text-text-muted mt-4 relative z-10">Any file up to 50MB</p>
      </div>

      {file && (
        <div className="mt-8 glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
              <FileIcon className="text-primary-light w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
              <p className="text-xs text-text-muted mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="ml-4 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center min-w-[120px] justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload File'}
          </button>
        </div>
      )}

      {status.message && (
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 shadow-lg animate-fade-in-up ${
          status.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
