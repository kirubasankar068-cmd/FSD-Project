import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CloudUpload, FileText, Camera, QrCode, Send, RefreshCcw, RefreshCw, 
  Loader2, Target, Cpu, CheckCircle, Activity, TrendingUp, 
  Languages, Banknote, Briefcase, Zap, Star, ShieldCheck, X, Download, AlertTriangle, EyeOff, Terminal, Sparkles, Wand2, Shield
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiMock } from '../services/apiMock';
import Layout from '../components/Layout';

export default function ResumeParser() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const queryClient = useQueryClient();
  const [showInsights, setShowInsights] = useState(false);

  // ── Physical Scan state ──
  const [showScanModal, setShowScanModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle | streaming | captured | processing
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ── Profile Linkage / QR state ──
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUser, setQrUser] = useState(null);

  // ── Advanced Optimization state ──
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [showOptimizationHub, setShowOptimizationHub] = useState(false);

  const startOptimization = () => {
    setIsOptimizing(true);
    let count = 0;
    const interval = setInterval(() => {
      setOptimizationScore(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const { mutate: parseResume, isPending, error, data: result } = useMutation({
    mutationFn: async (fileToUpload) => {
      return await apiMock.parseResume(fileToUpload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user']);
      queryClient.invalidateQueries(['insights-dashboard']);
      
      // Save skills to legacy key (kept for compatibility)
      if (data?.data?.skills) {
          localStorage.setItem('userSkills', JSON.stringify(data.data.skills));
      }

      // ✅ IMPORTANT: Merge parsed resume data back into the main 'user' object
      // so that Insights, Dashboard, and other pages see real-time data
      try {
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        const parsed = data?.data || {};
        
        const updatedUser = {
          ...existingUser,
          skills: parsed.skills?.length > 0 ? parsed.skills : existingUser.skills,
          resumeData: {
            ...(existingUser.resumeData || {}),
            skills: parsed.skills || existingUser.resumeData?.skills || [],
            atsScore: parsed.atsScore || parsed.marketCompatibility || existingUser.resumeData?.atsScore || 0,
            yearsOfExp: parsed.yearsOfExp || parsed.experience || existingUser.resumeData?.yearsOfExp || 0,
            title: parsed.title || parsed.targetRole || existingUser.resumeData?.title || null,
          }
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Dispatch event so Dashboard and other listeners refresh immediately
        window.dispatchEvent(new Event('userUpdate'));
      } catch (e) {
        console.error('Failed to sync resume data to user profile:', e);
      }

      setShowInsights(true);
      setResumeText(''); 
    }
  });

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      parseResume(selectedFile);
    }
  }, [parseResume]);

  // ── Camera / Scan helpers ──
  const startCamera = async () => {
    setScanStatus('streaming');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setScanStatus('error');
    }
  };

  const stopCamera = (stream) => {
    const s = stream || cameraStream;
    if (s) s.getTracks().forEach(t => t.stop());
    setCameraStream(null);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    stopCamera();
    setScanStatus('captured');
  };

  const processScan = () => {
    if (scanStatus !== 'captured') return;
    setScanStatus('processing');
    // Simulate OCR extraction — creates a text blob and runs it through the parser
    const simulatedOcrText = `Senior Software Engineer\nReact TypeScript Node.js AWS Docker PostgreSQL\nFull Stack Development experience. Frontend Architecture and system design skills.`;
    const blob = new Blob([simulatedOcrText], { type: 'text/plain' });
    const scanFile = new File([blob], 'physical-scan.txt', { type: 'text/plain' });
    parseResume(scanFile);
    setShowScanModal(false);
    setScanStatus('idle');
    setCapturedImage(null);
  };

  const closeScanModal = () => {
    stopCamera();
    setShowScanModal(false);
    setScanStatus('idle');
    setCapturedImage(null);
  };

  // ── QR Code helpers ──
  const openQrModal = () => {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : {};
    setQrUser(user);
    setShowQrModal(true);
  };

  const getQrUrl = (user) => {
    const profile = {
      name: user.name || 'Candidate',
      role: user.role || user.resumeData?.title || 'Professional',
      skills: (user.skills || []).slice(0, 5).join(', '),
      email: user.email || '',
      ats: user.resumeData?.atsScore || 0,
    };
    const encoded = encodeURIComponent(JSON.stringify(profile));
    // Google Charts QR API — works client-side with no install
    return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encoded}&choe=UTF-8`;
  };

  const downloadQr = () => {
    if (!qrUser) return;
    const link = document.createElement('a');
    link.href = getQrUrl(qrUser);
    link.download = `${(qrUser.name || 'profile').replace(/\s+/g, '-')}-qr.png`;
    link.target = '_blank';
    link.click();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleTextSubmit = () => {
      if (!resumeText.trim()) return;
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const textFile = new File([blob], "pasted-resume.txt", { type: "text/plain" });
      setFile(textFile);
      parseResume(textFile);
  };

  const syncState = () => {
      setShowInsights(false);
      setFile(null);
  };

  const clusterData = result?.data?.clusters ? Object.keys(result.data.clusters).map(key => ({
      name: key.toUpperCase(),
      density: result.data.clusters[key].length * 20 + 15,
  })) : [];

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <>
      <Layout>
        <div className="w-full flex flex-col items-center max-w-[1200px] mx-auto pb-20">
          
          {/* Centered Hero Content */}
          <div className="text-center mb-10 max-w-2xl mt-4">
              <h1 className="text-[40px] font-black text-slate-900 tracking-tighter mb-3 leading-tight">Resume Parser</h1>
              <p className="text-slate-400 font-bold text-base leading-relaxed opacity-70">
                  Effortlessly convert resumes into structured, searchable candidate profiles
              </p>
          </div>

          {error && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100/50 rounded-2xl text-rose-600 flex items-center justify-center gap-2 font-bold text-xs max-w-lg mx-auto w-full animate-in fade-in slide-in-from-top-2">
                  <Activity size={16} /> {error.message}
              </div>
          )}

          <AnimatePresence mode="wait">
          {!result || !showInsights ? (
              <motion.div 
                key="uploader"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full"
              >
                  {/* Unified Dashboard Card */}
                  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-5 flex flex-col md:flex-row overflow-hidden min-h-[460px] w-full gap-5">
                      
                      {/* Zone 1: Upload (Cream) */}
                      <div className="flex-1 rounded-[1.8rem] bg-gradient-to-br from-[#FFF5ED] to-[#FFF9F5] flex flex-col items-center justify-center p-12 transition-all hover:brightness-[0.98] group relative cursor-pointer" {...getRootProps()}>
                             <input {...getInputProps()} />
                             <div className="mb-8 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-orange-900/5 group-hover:scale-110 transition-transform">
                                 <CloudUpload size={48} className="text-[#D4A373]" strokeWidth={1} />
                             </div>
                             <h3 className="text-2xl font-black text-slate-800 mb-2">Upload a File</h3>
                             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-center leading-relaxed">
                                 Drop or click, supported formats:<br/>
                                 <span className="opacity-60">PDF, DOCX, TXT</span>
                             </p>

                             {isPending && (
                                  <div className="absolute inset-x-0 bottom-0 top-0 bg-white/60 rounded-[1.8rem] flex flex-col items-center justify-center animate-in fade-in">
                                      <Loader2 size={32} className="text-[#D4A373] animate-spin mb-2" />
                                  </div>
                              )}
                      </div>

                      {/* Zone 2: Paste (Teal) */}
                      <div className="flex-1 rounded-[1.8rem] bg-gradient-to-br from-[#EDF7F7] to-[#F5FAFA] flex flex-col p-12 transition-all hover:brightness-[0.98]">
                          <div className="flex items-center gap-5 mb-8">
                             <div className="w-16 h-16 bg-[#4D8076]/10 rounded-2xl flex items-center justify-center text-[#4D8076]">
                                 <Briefcase size={32} strokeWidth={1.5} />
                             </div>
                             <div>
                                 <h3 className="text-xl font-black text-slate-800">Paste Resume Text</h3>
                                 <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Enter raw text in the input field</p>
                             </div>
                          </div>

                          <div className="flex-1 relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                              <textarea 
                                  value={resumeText} 
                                  onChange={e => setResumeText(e.target.value)}
                                  placeholder="Paste resume text here for structured extraction..."
                                  className="flex-1 p-6 bg-transparent text-slate-700 text-sm focus:outline-none resize-none placeholder:text-slate-300 leading-relaxed font-medium min-h-[200px]"
                              />
                              <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{resumeText.length} / 10,000 characters</span>
                                  <button 
                                      onClick={handleTextSubmit}
                                      disabled={!resumeText.trim()}
                                      className="p-2 text-slate-300 hover:text-[#4D8076] disabled:hover:text-slate-300 transition-colors"
                                  >
                                      <Send size={20} strokeWidth={1.5} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Additional Tools & Footer Alignment Row */}
                  <div className="flex flex-col lg:flex-row items-end justify-between mt-12 w-full gap-8 border-t border-slate-100/50 pt-10">
                      {/* Left: Additional Tools */}
                      <div className="flex flex-col gap-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-header">Additional Tools</span>
                          <div className="flex items-center gap-3">
                              <button 
                                onClick={() => { setShowScanModal(true); startCamera(); }}
                                className="flex items-center gap-3 bg-white border border-slate-100 px-6 py-3 rounded-2xl text-slate-600 font-bold text-[13px] hover:bg-slate-50 hover:border-[#4D8076]/30 hover:text-[#4D8076] transition-all shadow-sm group font-header"
                              >
                                  <Camera size={18} className="text-slate-400 group-hover:text-[#4D8076] transition-colors" /> Physical Scan
                              </button>
                              <button 
                                onClick={openQrModal}
                                className="flex items-center gap-3 bg-white border border-slate-100 px-6 py-3 rounded-2xl text-slate-600 font-bold text-[13px] hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm group font-header"
                              >
                                  <QrCode size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> Profile Linkage
                              </button>
                          </div>
                      </div>

                      {/* Right: Copyright notice */}
                      <div className="flex flex-col items-end gap-1 text-right">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none font-header">© 2024 Parser Engine</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-header">Neural Mapping Dashboard v2.0</p>
                      </div>
                  </div>
              </motion.div>
          ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10 pb-10"
              >
                  {/* Main Score Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-100 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Cpu size={140} className="text-blue-600" />
                          </div>
                          <div className="relative z-10 flex flex-col md:flex-row gap-10">
                            <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Neural Agent</span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Report ID: {Math.random().toString(36).substr(2, 9)}</span>
                              </div>
                              <h2 className="text-4xl font-black text-slate-900 leading-[1.1]">{result.data?.name}</h2>
                              <p className="text-xl font-bold text-blue-600 tracking-tight">{result.data?.title}</p>
                              <div className="h-px bg-slate-100 w-full" />
                              <p className="text-lg text-slate-600 leading-relaxed font-serif italic pr-12">
                                  "{result.data?.analysis?.executiveSummary}"
                              </p>
                            </div>
                            
                            <div className="w-full md:w-56 h-56 bg-white border-4 border-slate-50 rounded-full flex flex-col items-center justify-center shadow-inner relative shrink-0">
                               <div className="absolute inset-2 border-2 border-dashed border-blue-100 rounded-full animate-[spin_20s_linear_infinite]" />
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ATS Match</span>
                               <div className="flex items-baseline gap-1">
                                 <span className="text-6xl font-black text-blue-600 tracking-tighter">{result.data?.analysis?.gapAnalysis?.score}</span>
                                 <span className="text-slate-400 font-black text-xl">%</span>
                               </div>
                               <div className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black flex items-center gap-1">
                                 <ShieldCheck size={10} /> VERIFIED
                               </div>
                            </div>
                          </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-1 gap-6">
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Comp.</h4>
                                  <div className="text-3xl font-black text-slate-900">{result.data?.analysis?.marketCompatibility?.score || 88}%</div>
                                </div>
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                  <TrendingUp size={24} />
                                </div>
                              </div>
                              <div className="mt-6 flex flex-wrap gap-2">
                                  {(result.data?.analysis?.marketCompatibility?.trendsMatched || ['AI-Ready', 'Cloud-Scale']).map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100/50">#{t.replace(/\s+/g, '')}</span>
                                  ))}
                              </div>
                          </div>

                          <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-indigo-200/40 relative overflow-hidden group">
                              <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Zap size={80} className="text-white" fill="currentColor" />
                              </div>
                              <div className="relative z-10 flex flex-col justify-between h-full">
                                  <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Value</h4>
                                    <div className="text-4xl font-black text-white tracking-tighter">
                                      {result.data?.analysis?.salaryProjection?.currency || '$'}{result.data?.analysis?.salaryProjection?.min} - {result.data?.analysis?.salaryProjection?.max}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide">Avg Base / Annual Projection</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* ── ADVANCED FEATURE: ATS OPTIMIZATION HUB ── */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Terminal size={160} className="text-primary" />
                      </div>
                      
                      <div className="relative z-10 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                              <Shield size={14} /> Neural Guard v2.0 Active
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tight">ATS Optimization Hub</h3>
                            <p className="text-slate-400 font-medium">Bypass automated filters with semantic keyphrase injection.</p>
                          </div>
                          <button 
                            onClick={() => setShowOptimizationHub(!showOptimizationHub)}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
                          >
                            {showOptimizationHub ? 'Hide Analysis' : 'Expand Strategy'}
                          </button>
                        </div>

                        {showOptimizationHub && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10"
                          >
                            {/* Ghosting Risks */}
                            <div className="space-y-6">
                              <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                <EyeOff size={14} /> Ghosting Risk Detection
                              </h4>
                              <div className="space-y-4">
                                {[
                                  { label: 'Keyword Density', risk: 'High', color: 'text-rose-400' },
                                  { label: 'Formatting Compliance', risk: 'Medium', color: 'text-amber-400' },
                                  { label: 'Semantic Similarity', risk: 'Low', color: 'text-emerald-400' }
                                ].map((risk, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-xs font-bold text-slate-300">{risk.label}</span>
                                    <span className={`text-xs font-black uppercase tracking-widest ${risk.color}`}>{risk.risk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Semantic Injection */}
                            <div className="space-y-6">
                              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={14} /> Semantic Injection Points
                              </h4>
                              <div className="space-y-3">
                                {[
                                  'Hyper-scale Infrastructure Management',
                                  'Cross-functional Engineering Leadership',
                                  'Architectural Pattern Optimization'
                                ].map((phrase, i) => (
                                  <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all flex items-center justify-between">
                                    <p className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors italic">"{phrase}"</p>
                                    <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Inject</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="pt-4 flex flex-col md:flex-row gap-4">
                           <button 
                             onClick={startOptimization}
                             disabled={isOptimizing}
                             className="flex-1 py-5 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 relative overflow-hidden shadow-xl shadow-primary/20"
                           >
                             {isOptimizing && (
                               <motion.div 
                                 initial={{ left: '-100%' }}
                                 animate={{ left: '100%' }}
                                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                 className="absolute inset-y-0 w-1/3 bg-white/20 skew-x-12"
                               />
                             )}
                             <Wand2 size={18} /> {isOptimizing ? `Optimizing Vector... ${optimizationScore}%` : 'Pulse Optimize Profile'}
                           </button>
                           <button className="flex-1 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">
                             Download optimized doc
                           </button>
                        </div>
                      </div>
                  </div>

                  {/* Second Row: Language & Skills */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Insights & Language */}
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-100">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Languages size={24} />
                              </div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Feed</h3>
                            </div>
                          </div>

                          <div className="space-y-6">
                              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Voice</p>
                                  <p className="text-lg font-black text-slate-900">{result.data?.analysis?.languageAnalysis?.tone || 'Collaborative'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Power Score</p>
                                  <p className="text-2xl font-black text-emerald-600">{result.data?.analysis?.languageAnalysis?.actionVerbScore || 92}/100</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Zap size={14} className="text-blue-500" /> Targeted Optimizations
                                </h4>
                                {result.data?.analysis?.improvementTips?.map((insight, i) => (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`flex gap-5 p-5 rounded-[1.5rem] border bg-white shadow-sm hover:shadow-md transition-shadow ${insight.label === 'CRITICAL' ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'}`}>
                                      <div className="shrink-0 pt-0.5">
                                          {insight.label === 'CRITICAL' ? (
                                              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Activity size={18} /></div>
                                          ) : (
                                              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Zap size={18} /></div>
                                          )}
                                      </div>
                                      <div>
                                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${insight.label === 'CRITICAL' ? 'text-rose-600' : 'text-blue-600'}`}>{insight.label}</p>
                                          <p className="text-[13px] text-slate-700 font-bold leading-relaxed">{insight.tip}</p>
                                      </div>
                                  </motion.div>
                                ))}
                              </div>
                          </div>
                      </div>

                      {/* Role Paths & Skills */}
                      <div className="space-y-8">
                         <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-100">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
                              <Briefcase size={22} className="text-blue-600" /> Career Trajectories
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {(result.data?.analysis?.roleRecommendations || ['Solutions Architect', 'Product Leader', 'Founding SDE']).map((role, i) => (
                                <div key={i} className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-900 transition-all cursor-default">
                                  <span className="font-bold text-slate-700 group-hover:text-white transition-colors">{role}</span>
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Target size={16} className="text-blue-600" />
                                  </div>
                                </div>
                              ))}
                            </div>
                         </div>

                         <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-xl font-black text-white tracking-tight mb-2 flex items-center gap-3 relative z-10">
                              <Activity size={22} className="text-indigo-400" /> Architectural Density
                            </h3>
                            <p className="text-slate-400 text-xs font-medium mb-8 relative z-10">Skill cluster analysis from parsed resume vector</p>
                            
                            <div className="h-48 w-full relative z-10 min-h-[192px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={clusterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                        <YAxis hide />
                                        <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px'}} />
                                        <Bar dataKey="density" radius={[6, 6, 0, 0]}>
                                           {clusterData.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                           ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-slate-800 relative z-10">
                                <div className="flex flex-wrap gap-2">
                                    {(result.data?.skills || []).map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 shadow-sm">
                                          {skill.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                         </div>
                      </div>
                  </div>
              </motion.div>
          )}
          </AnimatePresence>
        </div>
      </Layout>

      {/* ════ PHYSICAL SCAN MODAL ════ */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeScanModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4D8076]/10 text-[#4D8076] rounded-2xl flex items-center justify-center">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Physical Scan</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Camera OCR Resume Capture</p>
                  </div>
                </div>
                <button onClick={closeScanModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Camera Viewport */}
              <div className="p-6">
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  {/* Hidden canvas for capture */}
                  <canvas ref={canvasRef} className="hidden" />

                  {scanStatus === 'streaming' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}

                  {scanStatus === 'captured' && capturedImage && (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  )}

                  {scanStatus === 'processing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                      <Loader2 size={40} className="text-[#4D8076] animate-spin" />
                      <p className="text-white font-black text-sm uppercase tracking-widest animate-pulse">Extracting Profile...</p>
                    </div>
                  )}

                  {scanStatus === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                      <AlertTriangle size={40} className="text-amber-400" />
                      <p className="text-white font-bold text-sm text-center px-6">Camera access denied. Please allow camera permissions in your browser and try again.</p>
                      <button
                        onClick={startCamera}
                        className="px-6 py-2 bg-[#4D8076] text-white rounded-xl font-bold text-sm hover:bg-[#3d6560] transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Scan overlay grid */}
                  {scanStatus === 'streaming' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-6 border-2 border-[#4D8076]/70 rounded-xl">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#4D8076] rounded-tl-md" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#4D8076] rounded-tr-md" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#4D8076] rounded-bl-md" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#4D8076] rounded-br-md" />
                        {/* Scanning line animation */}
                        <div className="absolute inset-x-4 h-0.5 bg-[#4D8076]/60 top-1/2 animate-bounce" />
                      </div>
                      <p className="absolute bottom-4 inset-x-0 text-center text-white text-[10px] font-black uppercase tracking-widest opacity-70">Align resume within frame</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3">
                  {scanStatus === 'streaming' && (
                    <button
                      onClick={captureFrame}
                      className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl hover:bg-[#4D8076] transition-colors flex items-center justify-center gap-3"
                    >
                      <Camera size={20} /> Capture
                    </button>
                  )}
                  {scanStatus === 'captured' && (
                    <>
                      <button
                        onClick={() => { setCapturedImage(null); setScanStatus('streaming'); startCamera(); }}
                        className="flex-1 h-14 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-3"
                      >
                        <RefreshCw size={18} /> Retake
                      </button>
                      <button
                        onClick={processScan}
                        className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl hover:bg-[#4D8076] transition-colors flex items-center justify-center gap-3"
                      >
                        <CheckCircle size={18} /> Extract Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ PROFILE LINKAGE / QR MODAL ════ */}
      <AnimatePresence>
        {showQrModal && qrUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Profile Linkage</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shareable QR Identity Node</p>
                  </div>
                </div>
                <button onClick={() => setShowQrModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* QR Content */}
              <div className="p-8 flex flex-col items-center gap-6">
                {/* QR Code */}
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-xl">
                  <img
                    src={getQrUrl(qrUser)}
                    alt="Profile QR Code"
                    className="w-56 h-56 block"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>

                {/* Profile Summary */}
                <div className="w-full space-y-3 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Encoded Profile Data</p>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-500">Name</span>
                    <span className="text-xs font-black text-slate-900">{qrUser.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-500">Role</span>
                    <span className="text-xs font-black text-slate-900">{qrUser.role || qrUser.resumeData?.title || 'Professional'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-500">ATS Signal</span>
                    <span className="text-xs font-black text-indigo-600">{qrUser.resumeData?.atsScore || 0}%</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-slate-500 flex-shrink-0">Skills</span>
                    <span className="text-xs font-black text-slate-900 text-right">{(qrUser.skills || []).slice(0,4).join(' · ') || 'Not parsed yet'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={downloadQr}
                    className="flex-1 h-12 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} /> Download QR
                  </button>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="h-12 px-6 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>

                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">
                  Scan with any device to view profile • No login required
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
