import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, MessageSquare, Upload, BookOpen } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Search', path: '/', icon: <Search size={20} /> },
    { name: 'Ask Documents', path: '/ask', icon: <MessageSquare size={20} /> },
    { name: 'Upload', path: '/upload', icon: <Upload size={20} /> },
    { name: 'Library', path: '/library', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light font-sans text-dark">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-xl">
                  K
                </div>
                <span className="font-bold text-xl text-dark tracking-tight">K-Finder</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
