import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { askQuestion } from '../services/api';

const AskDocuments = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I can answer questions based on the internal documents you\'ve uploaded. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input.trim();
    const newUserMsg = { id: Date.now(), type: 'user', text: query };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await askQuestion(query);
      
      const newBotMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.answer,
        source: data.source,
        score: data.score
      };
      
      setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an error while trying to answer your question.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full animate-fade-in-up">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-accent-purple" size={24} /> Ask AI
        </h1>
        <p className="text-text-secondary text-sm">Have a conversation with your corporate knowledge base.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 glass-panel rounded-3xl p-6 space-y-8 scrollbar-thin scrollbar-thumb-surface-light">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              msg.type === 'user' 
                ? 'bg-gradient-to-br from-primary to-accent-cyan text-white' 
                : 'bg-surface-light border border-white/10 text-primary-light'
            }`}>
              {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
              msg.type === 'user' 
                ? 'bg-primary/90 text-white ml-auto shadow-[0_4px_20px_rgba(255,255,255,0.15)]' 
                : 'glass-card text-text-primary'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
              
              {msg.source && (
                <div className="mt-5 flex items-start gap-3 bg-surface/40 p-3 rounded-xl border border-white/5">
                  <BookOpen size={16} className="mt-0.5 text-accent-cyan" />
                  <div>
                    <span className="font-semibold block text-white text-sm">Source: {msg.source}</span>
                    <span className="text-xs text-text-muted">Relevance: {Math.round(msg.score * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-surface-light border border-white/10 text-primary-light shadow-lg">
              <Bot size={20} />
            </div>
            <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 text-text-secondary">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1 px-6 py-4 bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-text-muted glow-focus shadow-lg"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary-dark focus:outline-none disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center min-w-[72px]"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AskDocuments;
