import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Layers } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'superadmin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend Login API call
      const res = await axios.post('https://agency-webiste-akqm.onrender.com/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 🔥 ASLI IDENTITY SAVE KARO (Bina override kiye) 🔥
      localStorage.setItem('afterus_token', res.data.token);
      localStorage.setItem('afterus_user', JSON.stringify(res.data.user));

      const realRole = res.data.user.role; // Database se aaya hua exact role

      // 🔥 REAL ROLE-BASED DYNAMIC REDIRECTION 🔥
      if (realRole === 'superadmin' || realRole === 'admin') {
        navigate('/dashboard');
      } else if (realRole === 'co-founder' || realRole === 'cofounder') {
        navigate('/cofounder-dashboard');
      } else {
        navigate('/calling-dashboard');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid credentials or connection timeout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background Graphic Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mt-20 -ml-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mb-20 -mr-20"></div>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10">
        
        {/* Brand Terminal Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">AfterUS<span className="text-blue-500">.</span></h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Unified Agency Terminal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 🔥 MNC GRADE ROLE SELECTOR (Now just for visual preference) 🔥 */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Access Node</label>
            <div className="relative">
              <Layers className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="superadmin" className="text-slate-900 font-bold">Founder / Super Admin</option>
                <option value="admin" className="text-slate-900 font-bold">Co-Founder (Strategy & Roadmaps)</option>
                <option value="telecaller" className="text-slate-900 font-bold">Outreach Desk (Telecaller)</option>
              </select>
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security Identity (Email)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                required 
                type="email" 
                placeholder="chief@afterusglobal.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Access Token (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                required 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-500 flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><span className="tracking-wide">Establish Connection</span> <ArrowRight size={16}/></>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;