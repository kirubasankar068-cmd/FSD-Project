import { useEffect, useState } from "react";
import { MapPin, Bookmark, Building2, TrendingUp, CheckCircle2, Sparkles, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from "../components/Layout";
import FilterPanel from "../components/FilterPanel";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";
import { apiMock } from "../services/apiMock";
import { jobsAPI, applicationsAPI } from "../services/api";
import useDebounce from "../hooks/useDebounce";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filters, setFilters] = useState({ industry: [], schedule: [] });
  const [sortBy, setSortBy] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  let user = null;
  let isPremium = false;
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
      isPremium = user.isPremium || false;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
  }

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (debouncedSearch) filters.q = debouncedSearch;
      if (locationFilter) filters.location = locationFilter;
      if (sortBy === 'salary') filters.sort = 'salary_desc';
      if (sortBy === 'latest') filters.sort = 'latest';
      
      filters.page = currentPage;
      filters.limit = 15;

      const data = await jobsAPI.getAll(filters);
      const apiJobs = data.jobs || [];
      
      if (apiJobs.length > 0) {
        setJobs(apiJobs);
        if (data.pagination) {
          setTotalJobs(data.pagination.total);
          setTotalPages(Math.ceil(data.pagination.total / (data.pagination.limit || 1)));
        } else {
          setTotalJobs(apiJobs.length);
          setTotalPages(1);
        }
      } else {
        await fallbackToMock();
      }
    } catch (err) {
      console.error('Error fetching jobs, falling back to mock data:', err);
      await fallbackToMock();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToMock = async () => {
      const mockResults = await apiMock.getAllJobs({ search: debouncedSearch });
      const limit = 15;
      const startIndex = (currentPage - 1) * limit;
      
      // Filter mock results by sort (very basic fallback)
      if (sortBy === 'salary') {
         // Sort high to low by looking at the first number in '₹5L - ₹25L'
         mockResults.sort((a, b) => {
            const payA = parseInt(a.salary.replace(/\D/g, '')) || 0;
            const payB = parseInt(b.salary.replace(/\D/g, '')) || 0;
            return payB - payA;
         });
      }
      
      setJobs(mockResults.slice(startIndex, startIndex + limit));
      setTotalJobs(mockResults.length);
      setTotalPages(Math.ceil(mockResults.length / limit));
  };

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [debouncedSearch, locationFilter, filters, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, debouncedSearch, locationFilter, filters, sortBy]);

  // Synchronize local search state with Universal URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [window.location.search]);

  const filteredJobs = jobs.filter(job => {
    let matchesIndustry = true;
    if (filters.industry && filters.industry.length > 0) {
      const jobCat = (job.category || '').toUpperCase();
      matchesIndustry = filters.industry.some(ind => jobCat.includes(ind.toUpperCase()) || ind.toUpperCase().includes(jobCat));
    }
    
    let matchesSchedule = true;
    if (filters.schedule && filters.schedule.length > 0) {
      const jobType = (job.type || job.jobType || '').toUpperCase();
      matchesSchedule = filters.schedule.some(sch => jobType.includes(sch.toUpperCase()) || sch.toUpperCase().includes(jobType));
    }
    
    return matchesIndustry && matchesSchedule;
  });

  const handleApply = async (jobId, isPremiumJob) => {
    if (!user) {
      const confirmLogin = confirm("You need to login first to apply for jobs.\n\nClick OK to login or Cancel to go back.");
      if (confirmLogin) {
        sessionStorage.setItem('pendingJobId', jobId);
        sessionStorage.setItem('pendingJobPremium', isPremiumJob);
        window.location.href = '/login';
      }
      return;
    }

    if (isPremiumJob && !isPremium) {
      if (confirm("This is a premium job. Would you like to upgrade to Premium to access it?")) {
        window.location.href = '/pricing';
      }
      return;
    }

    try {
      const data = await applicationsAPI.create({ jobId });
      const safeName = user.name || user.username || 'applicant';
      const userEmail = user.email || `${safeName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
      alert(`NODE_TRANSMITTED: Application logic successfully synced.\n\nStatus: ${data.status || 'Applied'}\n\n📧 Confirmation dispatch link: ${userEmail}`);
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.message || 'Network error detected: High-latency environment prevent node transmission.');
    }
  };

  useEffect(() => {
    const pendingJobId = sessionStorage.getItem('pendingJobId');
    const pendingJobPremium = sessionStorage.getItem('pendingJobPremium') === 'true';

    if (pendingJobId && user) {
      sessionStorage.removeItem('pendingJobId');
      sessionStorage.removeItem('pendingJobPremium');
      setTimeout(() => {
        handleApply(pendingJobId, pendingJobPremium);
      }, 500);
    }
  }, [user]);

  return (
    <Layout>
      <div className="jobs-page-wrapper">
        <div className="jobs-page-layout">
          
          {/* Left Sidebar: Promo + Filters */}
          <aside className="jobs-filter-sidebar">
            <FilterPanel onFilterChange={(newFilters) => setFilters(newFilters)} />
          </aside>

          {/* Main Content Area */}
          <div className="jobs-main-content">
            {/* Results Header */}
            <div className="jobs-header">
              <div className="jobs-header-left">
                <h1 className="jobs-title">Explore Active Jobs</h1>
                <span className="jobs-count bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-200 shadow-sm">
                  {totalJobs >= 1000 ? '1,000+ Available' : totalJobs >= 450 ? '450+ Available' : `${totalJobs.toLocaleString()} Available`}
                </span>
              </div>
              
              <div className="jobs-header-right">
                {/* Immediate Search Bar */}
                <div className="relative mr-4 flex items-center group">
                  <Search size={16} className="absolute left-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Title, Company, or Skill..."
                    className="pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 lg:w-80 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] transition-all placeholder:text-slate-300"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 text-slate-300 hover:text-slate-950 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <span className="jobs-sort-label">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="jobs-sort-select"
                >
                  <option value="latest">Last updated</option>
                  <option value="salary">Salary: High-Low</option>
                </select>
              </div>
            </div>

            {/* Job Grid */}
            <div className="jobs-grid">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    index={index}
                    userPremium={isPremium} 
                    onApply={() => handleApply(job._id, job.isPremium)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3.5rem] border border-slate-100 shadow-sm animate-in zoom-in">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Search size={40} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">No match protocols located</h3>
                   <p className="text-slate-400 mt-2 max-w-sm mx-auto">Try adjusting your skill filters or search query for better node alignment.</p>
                   <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-8 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                     Clear Sync
                   </button>
                </div>
              )}
              
              {/* Pagination Controls */}
              {!loading && totalPages > 1 && (
                <div className="col-span-full flex items-center justify-center gap-4 py-12 mt-6 border-t border-slate-200">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => prev - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:shadow-sm transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center gap-2 font-bold text-slate-700 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
                    <span className="text-[var(--primary)]">{currentPage}</span> 
                    <span className="text-slate-300 mx-1">/</span> 
                    <span>{totalPages}</span>
                  </div>
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-[var(--primary)] text-white shadow-lg shadow-primary/20 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
