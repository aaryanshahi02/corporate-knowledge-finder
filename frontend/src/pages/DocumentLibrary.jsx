import { useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../services/api';
import { Trash2, FileText, Loader2, Calendar } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 tracking-tight">Document Library</h1>
          <p className="text-gray-500">Manage all indexed corporate knowledge</p>
        </div>
        <div className="bg-blue-50 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
          {documents.length} File{documents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No documents yet</h3>
          <p className="text-gray-500 mb-6">Upload some files to start building your knowledge base.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Filename</th>
                  <th scope="col" className="px-6 py-4">Upload Date</th>
                  <th scope="col" className="px-6 py-4 border-l border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-primary">
                        <FileText size={18} />
                      </div>
                      <span className="truncate max-w-xs sm:max-w-md">{doc.filename}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-block ml-auto"
                        title="Delete Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
