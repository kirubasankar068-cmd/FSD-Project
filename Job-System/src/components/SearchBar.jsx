import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, ChevronDown } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('Experience');
  const [payment, setPayment] = useState('Per month');
  const [salary, setSalary] = useState(12000);

  const handleSearch = () => {
    if (onSearch) onSearch({ query, location, experience, payment, salary });
  };

  return (
    <div className="bg-[var(--secondary)] p-4 lg:p-6 rounded-[2.5rem] shadow-2xl transition-all duration-500 w-full animate-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
        
        {/* Role/Position */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-700/50 w-full group">
          <Search className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" size={18} />
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Designer"
              className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder-slate-500"
            />
          </div>
          <ChevronDown size={14} className="text-slate-600" />
        </div>

        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-700/50 w-full group">
          <MapPin className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" size={18} />
          <div className="flex-1">
             <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Work location"
              className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder-slate-500"
            />
          </div>
          <ChevronDown size={14} className="text-slate-600" />
        </div>

        {/* Experience */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-700/50 w-full group cursor-pointer">
          <Briefcase className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" size={18} />
          <select 
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-semibold text-white appearance-none cursor-pointer"
          >
            <option className="bg-[var(--secondary)]">Experience</option>
            <option className="bg-[var(--secondary)]">Junior</option>
            <option className="bg-[var(--secondary)]">Intermediate</option>
            <option className="bg-[var(--secondary)]">Senior</option>
          </select>
          <ChevronDown size={14} className="text-slate-600" />
        </div>

        {/* Payment Frequency */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-700/50 w-full group cursor-pointer">
          <Clock className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" size={18} />
          <select 
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-semibold text-white appearance-none cursor-pointer"
          >
            <option className="bg-[var(--secondary)]">Per month</option>
            <option className="bg-[var(--secondary)]">Per year</option>
            <option className="bg-[var(--secondary)]">Per project</option>
          </select>
          <ChevronDown size={14} className="text-slate-600" />
        </div>

        {/* Salary Slider */}
        <div className="w-full lg:w-72 px-8 py-3 flex flex-col justify-center min-w-[250px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salary range</span>
            <span className="text-xs font-bold text-white tracking-tight">$1,200 - ${salary.toLocaleString()}</span>
          </div>
          <div className="relative flex items-center h-4">
            <input 
              type="range" 
              min="1200" 
              max="20000" 
              step="100"
              value={salary}
              onChange={(e) => setSalary(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)] hover:accent-[var(--primary)]/80 transition-all"
            />
          </div>
        </div>

        {/* Search Button (Hidden or Integrated) - Adding a subtle one for function */}
        <button 
          onClick={handleSearch}
          className="lg:hidden w-full mt-4 bg-[var(--primary)] text-white py-3 rounded-2xl font-bold text-sm tracking-wider hover:bg-[var(--primary-dark)] transition-colors"
        >
          Find Opportunities
        </button>
      </div>
    </div>
  );
}


