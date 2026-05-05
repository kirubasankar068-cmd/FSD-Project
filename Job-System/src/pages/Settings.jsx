import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { userAPI } from '../services/api';
import { User, Settings as SettingsIcon, Bell, FileText, MapPin, Phone, Save, Upload, CheckCircle, ShieldCheck, Moon, Download, Link, Briefcase, Globe } from 'lucide-react';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    skills: '',
    dob: '',
    experience: 0,
    address: '',
    bio: ''
  });
  const { settings, updateSetting } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMessage, setResumeMessage] = useState('');

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setLoading(true);
    setResumeMessage('');
    try {
      await userAPI.uploadResume(resumeFile);
      setResumeMessage('Resume synchronization successful.');
      setResumeFile(null);
      // Refresh profile to update localStorage and UI
      await fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setUser(data);
      setForm({
        name: data.name || '',
        title: data.title || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        linkedin: data.linkedin || '',
        portfolio: data.portfolio || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        experience: Number(data.experience) || 0,
        address: data.address || '',
        bio: data.bio || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const updatedUser = await userAPI.updateProfile({
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        settings: settings // Sync AppContext settings to backend
      });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdate'));
      setMessage('Profile synchronized successfully.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportProfileDocument = () => {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${form.name || 'Candidate'} - Professional Profile</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; padding: 40px; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 50px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .name { font-size: 32px; font-weight: 900; margin: 0; color: #1e293b; letter-spacing: -0.5px; }
          .title { font-size: 20px; color: #4f46e5; margin-top: 5px; font-weight: 800; }
          .contact-info { margin-top: 15px; font-size: 14px; color: #64748b; display: flex; flex-wrap: wrap; gap: 15px; }
          .contact-item { display: flex; align-items: center; gap: 5px; }
          .section-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .content { margin-top: 15px; font-size: 15px; color: #334155; white-space: pre-wrap; }
          .skills-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
          .skill-badge { background: #e0e7ff; color: #4338ca; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid #c7d2fe; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="name">${form.name || 'Unknown Candidate'}</h1>
            <div class="title">${form.title || 'Professional Target'}</div>
            <div class="contact-info">
              <span class="contact-item">📧 ${form.email || 'N/A'}</span>
              <span class="contact-item">📱 ${form.phone || 'N/A'}</span>
              <span class="contact-item">📍 ${form.location || 'N/A'}</span>
            </div>
            ${form.linkedin || form.portfolio ? `
            <div class="contact-info" style="margin-top: 8px;">
              ${form.linkedin ? `<span class="contact-item">🔗 ${form.linkedin}</span>` : ''}
              ${form.portfolio ? `<span class="contact-item">🌐 ${form.portfolio}</span>` : ''}
            </div>` : ''}
          </div>

          <div class="section-title">Professional Abstract</div>
          <div class="content">${form.bio || 'Seeking challenging opportunities to utilize my skills and experience for mutual growth. Dedicated to achieving high structural alignment with organizational objectives.'}</div>

          <div class="section-title">Technical Competency Matrix</div>
          <div class="skills-container">
            ${(form.skills || '').split(',').map(s => s.trim()).filter(s => s).map(skill => `<div class="skill-badge">${skill}</div>`).join('')}
          </div>

          <div class="section-title">Operational Background</div>
          <div class="content">
             <p><strong>Total Industry Experience:</strong> ${form.experience || 0} Years</p>
             <p><strong>Date of Birth:</strong> ${form.dob || 'Not provided'}</p>
             <p><strong>Registered Base:</strong> ${form.address || 'Not provided'}</p>
          </div>
          
          <div class="footer">Verified by JobGrox Intelligence Network</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(form.name || 'Candidate').replace(/\s+/g, '_')}_Dossier.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-16 pb-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 text-white">
                <SettingsIcon size={32} />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic">System <span className="text-[var(--primary)]">Preferences</span></h1>
                <div className="flex items-center gap-3">
                   <ShieldCheck size={16} className="text-[var(--primary)]" />
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Profile Configuration | Node ID: {user?._id?.slice(-8).toUpperCase() || 'OFFLINE'}</p>
                </div>
              </div>
            </div>
            
            <button onClick={exportProfileDocument} className="px-6 py-4 bg-white text-[var(--primary)] border border-primary/20 font-bold rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all flex items-center gap-3 uppercase tracking-widest text-[10px] group">
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Export Candidate Dossier
            </button>
          </div>

          <div className="space-y-8">
            {/* Identity Section */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                 <div className="p-3 bg-[var(--primary-light)] rounded-xl text-[var(--primary)]"><User size={24} /></div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Professional Identity</h2>
              </div>

              {message && (
                <div className="p-4 bg-[var(--primary-light)] border border-[var(--primary-light)] rounded-2xl flex items-center gap-3 text-[var(--primary)] animate-in zoom-in-95 duration-300">
                  <CheckCircle size={18} />
                  <p className="text-sm font-bold uppercase tracking-wider">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Designation Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="Enter Full Name" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="e.g. Senior Frontend Engineer" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Link (Email)</label>
                  <input type="email" value={form.email} readOnly className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-medium cursor-not-allowed" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Communication Node (Phone)</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="+91 98XXX XXXXX" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LinkedIn Integration URL</label>
                  <div className="relative">
                    <Link className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Personal Portfolio / Website</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" name="portfolio" value={form.portfolio} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Geospatial Coordinates (City/Country)</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="e.g. Bangalore, India" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Total Work Experience (Years)</label>
                  <input type="number" name="experience" value={form.experience} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="0" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full md:w-1/2 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Abstract (Bio)</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows="4" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none" placeholder="Summarize your professional journey and career objectives..."></textarea>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technical Skill Clusters (Comma Separated)</label>
                  <input type="text" name="skills" value={form.skills} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" placeholder="React, Node.js, Python, AWS" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Physical Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows="3" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none" placeholder="Enter your full address..."></textarea>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                 <div className="p-3 bg-blue-50 rounded-xl text-blue-500"><FileText size={24} /></div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Talent Verification</h2>
              </div>

              <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center space-y-6 hover:border-[var(--primary)]/30 transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 group-hover:scale-110 transition-transform">
                   <Upload size={32} />
                </div>
                <div>
                   <p className="text-lg font-bold text-slate-800 tracking-tight">Synchronize Credentials</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF, DOCX accepted | Max Load 5MB</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                   <input type="file" id="resume" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
                   <label htmlFor="resume" className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-all text-xs">
                      {resumeFile ? resumeFile.name.slice(0, 15) + '...' : 'Select Terminal Log'}
                   </label>
                   <button onClick={handleResumeUpload} disabled={!resumeFile || loading} className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all text-xs">
                      Initiate Upload
                   </button>
                </div>
                {resumeMessage && <p className="text-emerald-600 text-xs font-bold pt-2">{resumeMessage}</p>}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                 <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Bell size={24} /></div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Protocol Notifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <label className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="space-y-1">
                       <p className="font-bold text-slate-800">Email Intercepts</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Match Alerts</p>
                    </div>
                    <input type="checkbox" checked={settings.emailAlerts} onChange={(e) => updateSetting('emailAlerts', e.target.checked)} className="w-6 h-6 rounded-lg text-primary focus:ring-0 cursor-pointer" />
                 </label>
                 <label className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="space-y-1">
                       <p className="font-bold text-slate-800">Operational Phase</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Phase Updates</p>
                    </div>
                    <input type="checkbox" checked={settings.notifications} onChange={(e) => updateSetting('notifications', e.target.checked)} className="w-6 h-6 rounded-lg text-primary focus:ring-0 cursor-pointer" />
                 </label>
                 <label className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="space-y-1 flex items-center gap-2">
                       <Moon size={16} className="text-slate-400" />
                       <p className="font-bold text-slate-800">Night Vision Mode</p>
                    </div>
                    <input type="checkbox" checked={settings.darkMode} onChange={(e) => updateSetting('darkMode', e.target.checked)} className="w-6 h-6 rounded-lg text-primary focus:ring-0 cursor-pointer" />
                 </label>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <button onClick={handleSave} disabled={loading} className="px-12 py-5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:bg-[var(--primary-dark)] transition-all flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]">
                <Save size={20} />
                Confirm Site-Wide Synchronization
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}



