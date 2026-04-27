import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, BookOpen } from 'lucide-react';
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              msg.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
              msg.type === 'user' ? 'bg-primary text-white ml-auto' : 'bg-gray-50 text-gray-800 border border-gray-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              
              {msg.source && (
                <div className="mt-4 flex items-start gap-2 text-xs bg-white/50 p-2.5 rounded border border-gray-200 text-gray-600">
                  <BookOpen size={14} className="mt-0.5 text-primary" />
                  <div>
                    <span className="font-semibold block text-gray-700">Source: {msg.source}</span>
                    <span className="opacity-80">Relevance: {Math.round(msg.score * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
              <Bot size={20} />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1 px-5 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-0 shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-4 bg-primary text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors shadow-sm"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AskDocuments;
