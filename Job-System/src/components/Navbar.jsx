import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, User, Bell, Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Navbar({ onToggleSidebar, hideToggle = false, isScrolled = false, fluid = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const [user, setUser] = useState(null);

  const fetchUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('userUpdate', fetchUser);
    return () => window.removeEventListener('userUpdate', fetchUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      const query = encodeURIComponent(navSearch.trim());
      // If we are already on a searchable hub, stay there but update the vector
      if (location.pathname === '/ai-match' || location.pathname === '/jobs') {
        navigate(`${location.pathname}?search=${query}`);
      } else {
        navigate(`/jobs?search=${query}`);
      }
      setNavSearch('');
    }
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Find Jobs', path: '/jobs' },
        { label: 'Companies', path: '/companies' },
        { label: 'Pricing', path: '/pricing' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Command', path: '/admin-dashboard' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Companies', path: '/companies' },
      ];
    }

    if (user.role === 'company') {
      return [
        { label: 'Dashboard', path: '/company-dashboard' },
        { label: 'Candidates', path: '/candidates' },
        { label: 'Post Job', path: '/post-job' },
        { label: 'Pricing', path: '/pricing' },
      ];
    }

    // Default Job Seeker
    return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Global Search', path: '/jobs' },
      { label: 'AI Match', path: '/ai-match' },
      { label: 'Resources', path: '/resources' },
    ];
  };

  const navLinks = getNavLinks();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Left: Toggle + Logo */}
        <div className="navbar-left">
          {!hideToggle && (
            <button
              onClick={onToggleSidebar}
              className="navbar-toggle-btn"
              title="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to="/" className="navbar-logo-link">
            <Logo className="navbar-logo-admin" />
          </Link>
        </div>

        {/* Center: Nav Links */}
        <div className="navbar-center">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-nav-link ${isActive(link.path) ? 'navbar-nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Search + Actions */}
        <div className="navbar-right">
          <form onSubmit={handleNavSearch} className="navbar-search-form">
            <Search className="navbar-search-icon" size={16} />
            <input 
              type="text" 
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search jobs..."
              className="navbar-search-input"
            />
          </form>

          <button className="navbar-icon-btn">
            <Bell size={18} />
            <span className="navbar-notification-dot"></span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="navbar-avatar-btn"
              >
                <div className="navbar-avatar">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              {showProfile && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                     <p className="navbar-dropdown-name">{user?.name || user?.email?.split('@')[0]}</p>
                     <p className="navbar-dropdown-email">{user?.email}</p>
                  </div>
                  <div className="navbar-dropdown-links">
                     <Link to="/settings" className="navbar-dropdown-link">
                        <Settings size={16} /> Settings
                     </Link>
                     <button onClick={logout} className="navbar-dropdown-link navbar-dropdown-logout">
                        <LogOut size={16} /> Logout
                     </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn active:scale-95">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
