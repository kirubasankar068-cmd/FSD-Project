import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from "../components/Layout";
import { Briefcase, Mail, Lock, User, ArrowRight, Building2, Eye, EyeOff, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

import { authAPI } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) newErrors.role = 'Please select a role';
    if (form.role === 'company' && !form.companyName.trim()) newErrors.companyName = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setServerError('');
    
    try {
      const data = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role === 'job_seeker' ? 'user' : form.role,
        companyName: form.role === 'company' ? form.companyName : undefined
      });

      // Most register APIs return the user and maybe a token, 
      // but let's assume we need to login or use the returned data
      setSuccess('Registration successful! Access Terminal Initialized...');
      
      // If the backend returns a token on register, store it
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || data));
      }

      setTimeout(() => {
        if (form.role === 'company') navigate('/company-dashboard');
        else navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.message || 'Registration protocol failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/30">
        <div className="w-full max-w-[540px] space-y-8">
          <div className="text-center space-y-4">
             <Logo />
             <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic">
               Initialize <span className="text-[var(--primary)]">
                 {form.role === 'company' ? 'Recruiter ' : form.role === 'job_seeker' ? 'Talent ' : ''}Account
               </span>
             </h1>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Join the JobGrox Enterprise Network</p>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
            {success ? (
               <div className="text-center space-y-6 py-10">
                  <div className="w-20 h-20 bg-[var(--primary-light)] rounded-3xl flex items-center justify-center mx-auto text-[var(--primary)]">
                     <CheckCircle size={40} />
                  </div>
                  <p className="text-lg font-bold text-slate-800 italic">{success}</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {serverError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-600 text-sm font-bold">{serverError}</p>
                  </div>
                )}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Identity</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="Full Name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Communication Link (Email)</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="work@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="******" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Key</label>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="******" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Role</label>
                     <div className="flex gap-4">
                        <button type="button" onClick={() => setForm({...form, role: 'job_seeker'})} className={`flex-1 p-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${form.role === 'job_seeker' ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                           <Briefcase size={20} /> Talent
                        </button>
                        <button type="button" onClick={() => setForm({...form, role: 'company'})} className={`flex-1 p-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${form.role === 'company' ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                           <Building2 size={20} /> Recruiter
                        </button>
                       </div>
                  </div>

                  {form.role === 'company' && (
                    <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Entity Designation</label>
                      <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="Company Name" />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                   {loading ? 'Processing...' : 'Complete Synchronization'} <ArrowRight size={20} />
                </button>
              </form>
            )}

            <div className="text-center">
               <p className="text-sm font-medium text-slate-500 italic">Already synchronized? <Link to="/" className="text-[var(--primary)] font-bold hover:underline">Access Terminal</Link></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
