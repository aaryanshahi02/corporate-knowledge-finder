import { useState } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';
import { searchDocuments } from '../services/api';

const highlightText = (text, query) => {
  if (!query || !text) return text;
  
  // Basic case-insensitive highlight
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((p, i) => 
        p.toLowerCase() === query.toLowerCase() ? 
          <span key={i} className="bg-yellow-200 font-medium text-blue-900 rounded px-0.5">{p}</span> : p
      )}
    </span>
  );
};

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await searchDocuments(query);
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleQuery = (text) => {
    setQuery(text);
    // Auto-trigger search after a brief timeout so state updates
    setTimeout(() => {
      document.getElementById('search-form')?.requestSubmit();
    }, 50);
  };

  return (
    <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${hasSearched ? 'mt-4' : 'mt-24'}`}>
      {!hasSearched && (
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-black text-dark tracking-tight mb-3">
            Corporate K-Finder
          </h1>
          <p className="text-lg text-gray-500">Search internal documents or ask questions</p>
        </div>
      )}

      <div className="w-full max-w-3xl">
        <form id="search-form" onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-lg shadow-sm hover:shadow transition-shadow"
            placeholder="Search documents or ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-2 right-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>

        {!hasSearched && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['leave policy', 'how many leaves are allowed?', 'remote work guidelines'].map((q) => (
              <button
                key={q}
                onClick={() => handleExampleQuery(q)}
                className="px-4 py-2 border border-blue-100 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="w-full max-w-4xl mt-10">
          <div className="mb-4 text-sm text-gray-500">
            {results.length > 0 ? `Found ${results.length} relevant snippet(s)` : (!loading && 'No documents found matching your query.')}
          </div>
          
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-6 py-4 flex items-start gap-4">
                  <div className="mt-1">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-primary break-all">
                        {result.filename}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {Math.round(result.score * 100)}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mt-2 whitespace-pre-wrap italic">
                      "...{highlightText(result.chunk, query)}..."
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
