import { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-dark mb-2">Upload Knowledge</h1>
        <p className="text-gray-500">Supported formats: PDF, DOCX, TXT</p>
      </div>

      <div 
        className={`mt-8 border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 bg-white shadow-sm ${
          isDragOver ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        <div className="flex text-sm text-gray-600 justify-center">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700 outline-none transition-colors"
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Any file under 50MB</p>
      </div>

      {file && (
        <div className="mt-8 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileIcon className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="ml-4 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center min-w-[100px] justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
          </button>
        </div>
      )}

      {status.message && (
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 shadow-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
