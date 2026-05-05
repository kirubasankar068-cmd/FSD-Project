import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Logo from "../components/Logo";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    
    // Clear any stale session nodes before re-auth
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    try {
      const data = await authAPI.login(form.email, form.password);
      
      // Ensure we have a valid token before proceeding
      if (!data.token) {
        throw new Error("Authentication failed: No token received from server.");
      }

      // Store real user data and token from backend
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setSuccess('Access Granted. Synchronizing session...');
      
      setTimeout(() => {
        // Redirect based on role returned from backend
        const userRole = data.user?.role;
        if (userRole === 'admin') navigate('/admin-dashboard');
        else if (userRole === 'company') navigate('/company-dashboard');
        else navigate('/candidate-dashboard');
      }, 1500);
    } catch (err) {
      console.error(">> LOGIN_UI_ERROR:", err.message);
      // Display the actual error message from the backend (extracted via api.js)
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("PASSWORD_RECOVERY_PROTOCOL: This feature is currently in maintenance. Please contact the system administrator to manually reset your credentials.");
  };

  const fillDemo = (role) => {
    const demos = {
      user: { email: 'seeker1@example.com', password: 'password123', role: 'user' },
      company: { email: 'recruiter1@company.com', password: 'password123', role: 'company' },
      admin: { email: 'admin@jobgrox.com', password: 'password123', role: 'admin' }
    };
    setForm(demos[role]);
    setErrors({});
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Logo className="scale-125" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                 {form.role === 'admin' ? 'System Command' : form.role === 'company' ? 'Recruiter Login' : form.role === 'user' ? 'Candidate Login' : 'Welcome Back'}
              </h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enter your credentials to continue</p>
            </div>
          </div>

          {success && (
            <div className="p-4 bg-[var(--primary-light)] border border-[var(--primary-light)] rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <CheckCircle className="text-[var(--primary)]" size={20} />
              <p className="text-[var(--primary)] text-sm font-bold">{success}</p>
            </div>
          )}

          {errors.server && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 text-sm font-bold">{errors.server}</p>
            </div>
          )}

          <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all font-semibold"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Access Level</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                  >
                    <option value="">Select Role</option>
                    <option value="user">Candidate</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-dark)] shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Log In <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-between pt-4">
              <Link to="/register" className="text-xs font-bold text-[var(--primary)] hover:underline">Create Account</Link>
              <button 
                onClick={handleForgotPassword}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-6 border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Quick Access Nodes (Testing)</p>
               <div className="grid grid-cols-3 gap-3">
                  {['user', 'company', 'admin'].map(r => (
                    <button 
                      key={r}
                      onClick={() => fillDemo(r)}
                      className="py-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
                    >
                      {r === 'user' ? 'Candidate' : r}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
