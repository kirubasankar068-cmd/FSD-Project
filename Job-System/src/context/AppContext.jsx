import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // State for Saved Jobs
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  // State for Favorites (Resources, Companies, etc.)
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  });

  // State for Recently Viewed Jobs
  const [recentViews, setRecentViews] = useState(() => {
    const recents = localStorage.getItem('recentViews');
    return recents ? JSON.parse(recents) : [];
  });

  // State for App Settings
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      notifications: true,
      emailAlerts: true,
      darkMode: false,
      autoApply: false,
    };
  });

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recentViews', JSON.stringify(recentViews));
  }, [recentViews]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    // Simple dark mode toggle via CSS variable / class on document root
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [settings]);

  const toggleSaveJob = (job) => {
    setSavedJobs(prev => {
      const jobId = job._id || job.id;
      const isAlreadySaved = prev.some(j => (j._id || j.id) === jobId);
      if (isAlreadySaved) {
        return prev.filter(j => (j._id || j.id) !== jobId);
      }
      return [...prev, job];
    });
  };

  const isSaved = (jobId) => savedJobs.some(j => (j._id || j.id) === jobId);

  const toggleFavorite = (item) => {
    if (!item) return;
    setFavorites(prev => {
      const itemId = item._id || item.id;
      const isFav = prev.find(i => (i._id || i.id) === itemId);
      if (isFav) {
        return prev.filter(i => (i._id || i.id) !== itemId);
      }
      
      // Standardize the favorite object for the UI
      const favItem = {
        ...item,
        id: itemId,
        type: item.type || (item.companyName ? 'company' : 'resource'),
        name: String(item.name || item.companyName || item.title || 'Unknown Entity'),
        description: String(item.description || item.descriptionFull || 'No documentation available.')
      };
      
      return [...prev, favItem];
    });
  };

  const isFavorite = (itemId) => favorites.some(i => (i._id || i.id) === itemId);

  const addRecentView = (item) => {
    if (!item) return;
    setRecentViews(prev => {
      const itemId = item._id || item.id;
      const filtered = prev.filter(i => (i._id || i.id) !== itemId);
      
      // Normalize item for recent views
      const recentItem = {
        ...item,
        id: itemId,
        type: item.type || (item.companyName ? 'company' : 'job'),
        viewedAt: new Date().toISOString()
      };
      
      return [recentItem, ...filtered].slice(0, 10); // keep last 10
    });
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const value = {
    savedJobs,
    toggleSaveJob,
    isSaved,
    favorites,
    toggleFavorite,
    isFavorite,
    recentViews,
    addRecentView,
    settings,
    updateSetting,
    notifications,
    setNotifications,
    unreadCount,
    markRead
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
