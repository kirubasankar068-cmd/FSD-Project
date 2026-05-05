import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Route Configuration Map ─────────────────────────────────────────────────
// Each route defines its layout behavior dynamically.
// Properties:
//   title       → Browser tab title (document.title)
//   showNav     → Whether to show the top Navbar
//   showSidebar → Whether to show the left Sidebar
//   fluid       → Whether the content area is full-width (no max-width container)
const ROUTE_CONFIG = {
  '/': {
    title: 'JobGrox — Connect with your Elite Future',
    showNav: true,
    showSidebar: false,
    fluid: true,
  },
  '/login': {
    title: 'JobGrox — Access Terminal',
    showNav: false,
    showSidebar: false,
    fluid: false,
  },
  '/register': {
    title: 'JobGrox — Initialize Account',
    showNav: false,
    showSidebar: false,
    fluid: false,
  },
  '/pricing': {
    title: 'JobGrox — Precision Strategy',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/dashboard': {
    title: 'JobGrox — Dashboard',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/user-dashboard': {
    title: 'JobGrox — User Dashboard',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/jobs': {
    title: 'JobGrox — Browse Jobs',
    showNav: true,
    showSidebar: false,
    fluid: true,
  },
  '/companies': {
    title: 'JobGrox — Corporate Network',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/applications': {
    title: 'JobGrox — Application Track',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/settings': {
    title: 'JobGrox — System Preferences',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/payments': {
    title: 'JobGrox — Finance Ledger',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/post-job': {
    title: 'JobGrox — Initialize Transmission',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/admin': {
    title: 'JobGrox — System Command',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/admin-dashboard': {
    title: 'JobGrox — System Command',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/company-dashboard': {
    title: 'JobGrox — Recruiter Terminal',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/candidates': {
    title: 'JobGrox — Candidates',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/messages': {
    title: 'JobGrox — Messages',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/notifications': {
    title: 'JobGrox — Notifications',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/saved': {
    title: 'JobGrox — Saved Jobs',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/favorites': {
    title: 'JobGrox — Favorite Opportunities',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/recent': {
    title: 'JobGrox — Recently Viewed',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/resources': {
    title: 'JobGrox — Strategic Resources',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/ai-match': {
    title: 'JobGrox — AI Matching Engine',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/resume-parser': {
    title: 'JobGrox — Intelligence Parser',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/skills': {
    title: 'JobGrox — Skill Gap Analysis',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/insights': {
    title: 'JobGrox — Market Intelligence',
    showNav: true,
    showSidebar: true,
    fluid: false,
  },
  '/logout': {
    title: 'JobGrox — Logging Out',
    showNav: false,
    showSidebar: false,
    fluid: false,
  },
};

// Default config for any route not explicitly listed (dynamic routes like /company/:id)
const DEFAULT_CONFIG = {
  title: 'JobGrox',
  showNav: true,
  showSidebar: true,
  fluid: false,
};

/**
 * Resolves the layout configuration for the current route.
 * Supports exact matches and prefix-based fallback for dynamic routes.
 */
function getRouteConfig(pathname) {
  // 1. Check exact match first
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }

  // 2. Prefix-based match for dynamic routes (e.g., /company/:id)
  if (pathname.startsWith('/company/')) {
    return {
      title: 'JobGrox — Company Details',
      showNav: true,
      showSidebar: true,
      fluid: false,
    };
  }

  if (pathname.startsWith('/job/')) {
    return {
      title: 'JobGrox — Connection Details',
      showNav: true,
      showSidebar: false,
      fluid: true,
    };
  }

  // 3. Fallback to defaults
  return DEFAULT_CONFIG;
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Dynamically resolve layout config from route ──
  const routeConfig = getRouteConfig(location.pathname);
  const { showNav, showSidebar, fluid, title: pageTitle } = routeConfig;

  // ── Dynamic document.title ──
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarState');
    return saved === 'collapsed';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const mainRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsPremium(parsedUser.isPremium || false);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    syncUser();

    // Listen for custom 'userUpdate' (same tab) and 'storage' (cross-tab) events
    window.addEventListener('userUpdate', syncUser);
    window.addEventListener('storage', syncUser);

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('userUpdate', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = () => {
    if (mainRef.current) {
      setScrolled(mainRef.current.scrollTop > 20);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarState', newState ? 'collapsed' : 'expanded');
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  // Calculate sidebar offset dynamically
  const sidebarOffset = showSidebar && isDesktop 
    ? (isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)') 
    : '0';

  return (
    <div className="layout-root">
      {/* Mobile Backdrop */}
      {showSidebar && isMobileOpen && (
        <div 
          className="layout-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - only when showSidebar is true (resolved dynamically) */}
      {showSidebar && (
        <AdminSidebar 
          user={user} 
          isPremium={isPremium} 
          onLogout={handleLogout} 
          onClose={() => setIsMobileOpen(false)} 
          collapsed={isCollapsed}
          onToggle={toggleSidebar}
          isMobileOpen={isMobileOpen}
        />
      )}

      {/* Main Content Area */}
      <div 
        className="layout-main"
        style={{ marginLeft: sidebarOffset }}
      >
        {/* Header */}
        {showNav && (
          <header className={`layout-header ${scrolled ? 'layout-header-scrolled' : ''}`}>
            <Navbar 
              onToggleSidebar={!isDesktop ? toggleMobile : toggleSidebar} 
              hideToggle={!showSidebar} 
              isScrolled={scrolled} 
              fluid={fluid} 
            />
          </header>
        )}

        {/* Page Content */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className="layout-content"
        >
          <div className={`layout-content-inner ${fluid ? 'layout-content-fluid' : 'container-custom'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

