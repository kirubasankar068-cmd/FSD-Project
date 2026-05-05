import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect, Fragment, Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Lazy load standard pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Jobs = lazy(() => import('./pages/Jobs'));
const CandidateDashboard = lazy(() => import('./pages/CandidateDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Home = lazy(() => import('./pages/Home'));
const Logout = lazy(() => import('./components/Logout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Applications = lazy(() => import('./pages/Applications'));
const Companies = lazy(() => import('./pages/Companies'));
const Payments = lazy(() => import('./pages/Payments'));
const Settings = lazy(() => import('./pages/Settings'));
const PostJob = lazy(() => import('./pages/PostJob'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Candidates = lazy(() => import('./pages/Candidates'));
const Messages = lazy(() => import('./pages/Messages'));

// Lazy load AI & Insights pages
const AiMatch = lazy(() => import("./pages/AiMatch"));
const ResumeParser = lazy(() => import("./pages/ResumeParser"));
const SkillAnalyzer = lazy(() => import("./pages/SkillAnalyzer"));
const Insights = lazy(() => import("./pages/Insights"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const Favorites = lazy(() => import("./pages/Favorites"));
const RecentlyViewed = lazy(() => import("./pages/RecentlyViewed"));
const Resources = lazy(() => import("./pages/Resources"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Fragment>
      <Routes location={location}>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } />

        <Route path="/job/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />

        <Route path="/candidate-dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/company-dashboard" element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyDashboard />
          </ProtectedRoute>
        } />

        <Route path="/applications" element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        } />

        <Route path="/companies" element={
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        } />

        {/* NEW ROUTE */}
        <Route path="/company/:id" element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/post-job" element={
          <ProtectedRoute allowedRoles={['company']}>
            <PostJob />
          </ProtectedRoute>
        } />

        <Route path="/logout" element={<Logout />} />

        {/* Missing / Placeholder Routes */}
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Feature Routes */}
        <Route path="/ai-match" element={<ProtectedRoute><AiMatch /></ProtectedRoute>} />
        <Route path="/resume-parser" element={<ProtectedRoute><ResumeParser /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillAnalyzer /></ProtectedRoute>} />
        <Route path="/skill-analyzer" element={<ProtectedRoute><SkillAnalyzer /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/recent" element={<ProtectedRoute><RecentlyViewed /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />


      </Routes>
    </Fragment>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="page-enter">
               <ErrorBoundary>
                 <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div></div>}>
                   <AnimatedRoutes />
                 </Suspense>
               </ErrorBoundary>
            </div>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;