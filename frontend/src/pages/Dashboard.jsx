import { useState } from 'react';
import { Search, FileText, Loader2, Sparkles } from 'lucide-react';
import { searchDocuments } from '../services/api';

const highlightText = (text, query) => {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((p, i) => 
        p.toLowerCase() === query.toLowerCase() ? 
          <span key={i} className="bg-primary/20 text-primary-light font-medium rounded px-1">{p}</span> : p
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
    setTimeout(() => {
      document.getElementById('search-form')?.requestSubmit();
    }, 50);
  };

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ease-in-out ${hasSearched ? 'mt-4' : 'mt-24'}`}>
      {!hasSearched && (
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-cyan mb-6">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI-Powered Knowledge Retrieval</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Discover Answers Instantly
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-4">
            Search across your entire corporate knowledge base or ask a specific question.
          </p>
        </div>
      )}

      <div className="w-full max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <form id="search-form" onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-text-muted group-focus-within:text-primary-light transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-36 py-5 bg-surface/50 backdrop-blur-md border border-white/10 rounded-full leading-5 text-white placeholder-text-muted glow-focus sm:text-lg transition-all"
            placeholder="Search documents or ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-2 right-2 px-8 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Search'}
          </button>
        </form>

        {!hasSearched && (
          <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {[
              'leave policy', 
              'How many leaves are employees allowed?', 
              'database backup',
              'What is the process for database backup?',
              'Can interns work remotely?'
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleExampleQuery(q)}
                className="px-5 py-2.5 border border-white/5 rounded-full text-sm bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white transition-all shadow-sm backdrop-blur-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="w-full max-w-4xl mt-12 animate-fade-in-up">
          <div className="mb-6 flex items-center justify-between text-sm text-text-secondary border-b border-white/10 pb-4">
            <span>
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Searching...</span>
              ) : results.length > 0 ? (
                `Found ${results.length} relevant snippet(s)`
              ) : (
                'No documents found matching your query.'
              )}
            </span>
          </div>
          
          <div className="space-y-5">
            {results.map((result, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-6"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-5">
                  <div className="mt-1 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary-light">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white truncate pr-4">
                        {result.filename}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 whitespace-nowrap">
                        {Math.round(result.score * 100)}% Match
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mt-3 whitespace-pre-wrap italic">
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
