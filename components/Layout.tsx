import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, LineChart, MessageSquareText, ShieldCheck, Menu, X, Bell, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.PLANNING, label: 'Planning & Analysis', icon: LineChart },
    { id: ViewState.ADVISOR, label: 'AI Advisor', icon: MessageSquareText },
  ];

  return (
    <div className="flex h-screen bg-[#F4F6F5] text-gray-800 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
          <div className="w-8 h-8 bg-fidelity rounded flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-fidelity tracking-tight">PlanView</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-fidelity/10 text-fidelity font-semibold border-l-4 border-fidelity'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-fidelity'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-fidelity rounded flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-lg font-bold text-fidelity">PlanView</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-10" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md ${
                    activeView === item.id
                      ? 'bg-fidelity/10 text-fidelity font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:relative pt-16 md:pt-0">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
           <h1 className="text-2xl font-bold text-gray-800">
             {navItems.find(n => n.id === activeView)?.label}
           </h1>
           <div className="flex items-center space-x-4">
             <button className="relative p-2 text-gray-500 hover:text-fidelity transition-colors">
               <Bell size={20} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="px-4 py-2 bg-fidelity text-white rounded-md text-sm font-medium hover:bg-fidelity-dark transition-colors shadow-sm">
               Talk to Advisor
             </button>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
