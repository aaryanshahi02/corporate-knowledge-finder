import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, MessageSquare, Upload, BookOpen, Globe } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Search', path: '/', icon: <Search size={18} /> },
    { name: 'Ask AI', path: '/ask', icon: <MessageSquare size={18} /> },
    { name: 'Upload', path: '/upload', icon: <Upload size={18} /> },
    { name: 'Library', path: '/library', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Globe size={22} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Query Sphere</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 bg-surface/50 p-1.5 rounded-xl border border-white/5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
