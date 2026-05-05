import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Users,
  Building2,
  Mail,
  Bell,
  Bookmark,
  Settings,
  BookOpen,
  LogOut,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileSearch,
  BarChart3,
  History,
  Star,
  User,
  ChevronDown,
  X,
  Crown
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ user, isPremium, onLogout, onClose, collapsed, onToggle, isMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { savedJobs, favorites, recentViews, unreadCount } = useAppContext();
  const [unreadMessages, setUnreadMessages] = useState(3);
  const hasNotifications = unreadCount > 0;

  const dashboardItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/candidate-dashboard' },
    { id: 'jobs', icon: Search, label: 'Browse Jobs', path: '/jobs' },
    { id: 'candidates', icon: Users, label: 'Candidates', path: '/candidates' },
    { id: 'companies', icon: Building2, label: 'Companies', path: '/companies' },
    { id: 'messages', icon: Mail, label: 'Messages', path: '/messages', badge: unreadMessages },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications', dot: hasNotifications },
  ];

  const intelligenceItems = [
    { id: 'ai-match', icon: Sparkles, label: 'AI Match', path: '/ai-match' },
    { id: 'resume-parser', icon: FileSearch, label: 'Resume Parser', path: '/resume-parser' },
    { id: 'skill-analyzer', icon: TrendingUp, label: 'Skill Analyzer', path: '/skills' },
    { id: 'insights', icon: BarChart3, label: 'Insights', path: '/insights' },
  ];

  const systemItems = [
    { id: 'upgrade', icon: Crown, label: 'Upgrade Account', path: '/pricing' },
    { id: 'saved', icon: Bookmark, label: 'Saved Jobs', path: '/saved', badge: savedJobs.length },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'resources', icon: BookOpen, label: 'Resources', path: '/resources' },
    { id: 'recent', icon: History, label: 'Recently Viewed', path: '/recent', badge: recentViews.length },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const NavItem = ({ item, collapsed }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={item.path}
          data-item-id={item.id}
          data-active={active}
          role="menuitem"
          aria-current={active ? 'page' : undefined}
          title={collapsed ? item.label : undefined}
          className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}
        >
          <div className="sidebar-nav-icon-wrap">
            <Icon size={18} className={active ? 'sidebar-icon-active' : ''} />
            {item.badge > 0 && (
              <span className="sidebar-badge">{item.badge}</span>
            )}
            {item.dot && (
              <span className="sidebar-dot"></span>
            )}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="sidebar-nav-label"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {active && !collapsed && (
            <motion.div 
              layoutId="active-dot"
              className="sidebar-active-dot"
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`sidebar-container ${isMobileOpen ? 'sidebar-mobile-open' : ''} shadow-sm`}
      data-state={collapsed ? 'collapsed' : 'expanded'}
    >
      {/* Branding */}
      <div className="p-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/candidate-dashboard')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
             <TrendingUp size={18} />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Job<span className="text-indigo-600">Grox</span>
            </span>
          )}
        </div>

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
            title="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Dashboard Section */}
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dashboard</p>}
          <div className="space-y-1">
            {dashboardItems.map(item => <NavItem key={item.id} item={item} collapsed={collapsed} />)}
          </div>
        </div>

        {/* Intelligence Section */}
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Intelligence</p>}
          <div className="space-y-1">
            {intelligenceItems.map(item => <NavItem key={item.id} item={item} collapsed={collapsed} />)}
          </div>
        </div>

        {/* System Section */}
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">System</p>}
          <div className="space-y-1">
            {systemItems.map(item => <NavItem key={item.id} item={item} collapsed={collapsed} />)}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full p-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user?.name?.[0] || 'U'}
               </div>
               {!collapsed && (
                 <div className="text-left min-w-0">
                   <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                   <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">{user?.role || 'Member'}</p>
                 </div>
               )}
            </div>
            {!collapsed && <ChevronDown size={14} className={`text-slate-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />}
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50"
              >
                <Link to="/profile" className="flex items-center gap-2 p-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <User size={14} /> Profile Settings
                </Link>
                <div className="h-px bg-slate-50 my-1"></div>
                <button onClick={onLogout} className="w-full flex items-center gap-2 p-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <LogOut size={14} /> Termination Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
