import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Phone, CheckCircle2, XCircle, Clock, Ban, User, Loader2, LogOut, LayoutList, ChevronRight, CalendarDays, BarChart3, Timer } from 'lucide-react';

const CallingDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('afterus_user') || '{}');
  
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({ date: '', time: '' });
  
  // 🔥 DYNAMIC STATS STATES
  const [dailyCalls, setDailyCalls] = useState(0);
  const [sessionTime, setSessionTime] = useState('00:00:00');

  // 🔥 NEW: FOLLOW UP STATE
  const [followUpList, setFollowUpList] = useState([]);
  
  const idleTimer = useRef(null);
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 Minutes

  // LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem('afterus_token');
    localStorage.removeItem('afterus_user');
    localStorage.removeItem('afterus_login_time');
    navigate('/'); 
  };

  // AUTO LOGOUT TIMER
  const resetTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      alert("Session expired due to 30 minutes of inactivity. Please log in again.");
      handleLogout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(idleTimer.current);
    };
  }, []);

  // 🔥 LIVE SESSION TIMER
  useEffect(() => {
    let loginTimestamp = localStorage.getItem('afterus_login_time');
    if (!loginTimestamp) {
      loginTimestamp = Date.now();
      localStorage.setItem('afterus_login_time', loginTimestamp);
    }

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - parseInt(loginTimestamp)) / 1000);
      
      const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(diffInSeconds % 60).padStart(2, '0');
      
      setSessionTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // 🔥 DAILY CALLS & FOLLOW UPS INITIAL LOAD
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedStats = JSON.parse(localStorage.getItem('afterus_call_stats') || '{}');
    
    if (storedStats.date === today) {
      setDailyCalls(storedStats.count);
    } else {
      setDailyCalls(0);
      localStorage.setItem('afterus_call_stats', JSON.stringify({ date: today, count: 0 }));
    }

    // Load Follow Up List based on user email to keep it specific to the logged-in telecaller
    const savedFollowUps = JSON.parse(localStorage.getItem(`afterus_followups_${user.email}`) || '[]');
    setFollowUpList(savedFollowUps);
  }, [user.email]);

  // 🔥 INCREMENT CALL COUNT
  const incrementCallCount = () => {
    const today = new Date().toLocaleDateString();
    const storedStats = JSON.parse(localStorage.getItem('afterus_call_stats') || '{}');
    let newCount = 1;
    if (storedStats.date === today) {
      newCount = (storedStats.count || 0) + 1;
    }
    localStorage.setItem('afterus_call_stats', JSON.stringify({ date: today, count: newCount }));
    setDailyCalls(newCount);
  };

  // 🔥 ADD LEAD TO FOLLOW UP LIST
  const addToFollowUpList = (lead) => {
    setFollowUpList(prev => {
      // Check if already in the list to avoid duplicates
      if (prev.find(item => item._id === lead._id)) return prev;
      const newList = [...prev, lead];
      localStorage.setItem(`afterus_followups_${user.email}`, JSON.stringify(newList));
      return newList;
    });
  };

  // 🔥 REMOVE LEAD FROM FOLLOW UP LIST
  const removeFromFollowUpList = (leadId) => {
    setFollowUpList(prev => {
      const newList = prev.filter(item => item._id !== leadId);
      localStorage.setItem(`afterus_followups_${user.email}`, JSON.stringify(newList));
      return newList;
    });
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get('https://agency-webiste-akqm.onrender.com//api/leads/calling-leads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` }
      });
      setLeads(res.data);
      if (res.data.length > 0 && !selectedLead) setSelectedLead(res.data[0]);
    } catch (error) { console.error("Error fetching leads:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const submitAction = async (status, extraData = {}) => {
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      await axios.put(`https://agency-webiste-akqm.onrender.com//api/leads/update-status/${selectedLead._id}`, {
        status, ...extraData
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` } });
      
      showNotification(`✅ ${selectedLead.clientName} updated successfully!`);
      incrementCallCount();
      
      // 🔥 NEW FEATURE: Add to Right Side List if marked as FollowUp
      if (status === 'FollowUp') {
        addToFollowUpList(selectedLead);
      }

      if (status !== 'FollowUp' && status !== 'New') setSelectedLead(null);
      await fetchLeads();
    } catch (error) { alert('Error updating!'); }
    finally { setActionLoading(false); setIsMeetingModalOpen(false); }
  };

  const handleActionClick = (status) => {
    if (status === 'Scheduled') setIsMeetingModalOpen(true);
    else submitAction(status);
  };

  if (loading) return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 size={44} className="animate-spin text-blue-600 mb-4"/>
      <p className="text-slate-500 font-bold tracking-wide">Loading Terminal...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans overflow-hidden relative">
      
      {/* SUCCESS TOAST */}
      {notification && (
        <div className="absolute top-24 right-8 bg-emerald-500 text-white px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] font-bold flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} /> {notification}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 h-20 px-8 flex justify-between items-center flex-shrink-0 z-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">AfterUS<span className="text-blue-600">.</span> CRM</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Outreach Terminal</p>
        </div>
        
        {/* PREMIUM STATS PILL */}
        <div className="flex items-center gap-8 bg-slate-50/80 px-6 py-2.5 rounded-2xl border border-slate-100 shadow-inner">
           <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
             <div className="bg-blue-100 p-1.5 rounded-lg"><BarChart3 size={16} className="text-blue-600"/></div> 
             Calls Today: <span className="text-blue-600 text-lg ml-1">{dailyCalls}</span>
           </div>
           <div className="w-px h-6 bg-slate-200"></div>
           <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
             <div className="bg-blue-100 p-1.5 rounded-lg"><Timer size={16} className="text-blue-600"/></div> 
             Session: <span className="font-mono text-blue-600 text-lg tracking-wider ml-1">{sessionTime}</span>
           </div>
        </div>

        <div className="flex items-center gap-5">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{user.name || 'Telecaller'}</p>
              <p className="text-[10px] uppercase text-blue-600 font-black tracking-widest">{user.role || 'Outreach'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-white flex items-center justify-center font-black shadow-md">
              {user.name ? user.name[0] : 'O'}
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all" title="Logout">
              <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* SPLIT PANE (Now divided in 3 parts: 28% - Auto - 25%) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANE (LEAD LIST) */}
        <div className="w-[28%] bg-white border-r border-slate-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0 flex-shrink-0">
          <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center sticky top-0">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <LayoutList size={16} className="text-blue-600"/> Pending Queue
            </h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-lg border border-blue-100">
              {leads.length} left
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <CheckCircle2 size={48} className="text-emerald-400 mb-4 opacity-50" />
                <p className="text-lg font-bold text-slate-600">Inbox Zero!</p>
                <p className="text-sm">Great job, no pending leads.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div 
                  key={lead._id} 
                  onClick={() => setSelectedLead(lead)} 
                  className={`p-6 border-b border-slate-50 cursor-pointer transition-all duration-200 group flex items-center justify-between ${
                    selectedLead?._id === lead._id 
                      ? 'bg-blue-50/50 border-l-4 border-l-blue-600' 
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.clientName}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Clock size={12}/> {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        lead.status === 'FollowUp' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={selectedLead?._id === lead._id ? "text-blue-600" : "text-slate-300 group-hover:text-blue-400"} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER PANE (ACTION CARD) */}
        <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-8 relative overflow-y-auto min-w-[400px]">
          {selectedLead ? (
            <div className="max-w-2xl w-full bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              
              <div className="flex items-center gap-8 mb-12">
                <div className="w-24 h-24 rounded-[1.5rem] bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0 shadow-sm">
                  <User size={40} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedLead.clientName}</h2>
                  <p className="text-blue-600 font-black text-xl flex items-center gap-2 mt-2">
                    <Phone size={20}/> {selectedLead.phoneNumber}
                  </p>
                  <p className="text-sm font-bold text-slate-500 mt-3 inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                    Need: <span className="text-slate-800">{selectedLead.serviceNeeded}</span>
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS (MNC STYLE) */}
              <div className="grid grid-cols-2 gap-5">
                {[
                  { name: 'Meeting Set', status: 'Scheduled', icon: <CheckCircle2 size={22} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm hover:shadow-emerald-500/30' },
                  { name: 'Follow Up', status: 'FollowUp', icon: <Clock size={22} />, color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm hover:shadow-amber-500/30' },
                  { name: 'Rejected', status: 'Rejected', icon: <XCircle size={22} />, color: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm hover:shadow-red-500/30' },
                  { name: 'Invalid', status: 'Invalid', icon: <Ban size={22} />, color: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-700 shadow-sm hover:shadow-slate-500/30' },
                ].map((btn) => (
                  <button
                    key={btn.name}
                    disabled={actionLoading}
                    onClick={() => handleActionClick(btn.status)}
                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-base transition-all duration-300 border ${btn.color} ${actionLoading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}
                  >
                    {actionLoading && selectedLead.status === btn.status ? <Loader2 size={22} className="animate-spin" /> : btn.icon} 
                    {btn.name}
                  </button>
                ))}
              </div>

            </div>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center">
              <div className="w-32 h-32 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6">
                <Phone size={48} className="text-slate-200" />
              </div>
              <p className="text-2xl font-black text-slate-400">Select a lead from the queue</p>
              <p className="text-sm font-bold mt-2">Start dialing to process inquiries.</p>
            </div>
          )}
        </div>

        {/* 🔥 NEW RIGHT PANE: PERSONAL FOLLOW-UP LIST 🔥 */}
        <div className="w-[25%] bg-white border-l border-slate-100 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-0 flex-shrink-0">
          <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center sticky top-0">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-amber-500"/> My Follow Ups
            </h2>
            <span className="bg-amber-50 text-amber-700 text-xs font-black px-3 py-1.5 rounded-lg border border-amber-100">
              {followUpList.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {followUpList.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-slate-300"/>
                </div>
                <p className="text-sm font-bold">No Follow-Ups saved.</p>
              </div>
            ) : (
              followUpList.map(lead => (
                <div key={lead._id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative group hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 text-sm truncate pr-6">{lead.clientName}</h3>
                  <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                    <Phone size={12}/> {lead.phoneNumber}
                  </p>
                  <button 
                    onClick={() => setSelectedLead(lead)} 
                    className="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    View / Call
                  </button>
                  
                  {/* Delete from Personal List Button */}
                  <button 
                    onClick={() => removeFromFollowUpList(lead._id)} 
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full" 
                    title="Remove from My List"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* MEETING GLASSMORPHISM MODAL */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-10 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <CalendarDays size={28} className="text-blue-600"/> Schedule Meeting
            </h2>
            <p className="text-slate-500 text-sm font-semibold mb-8">Locking in the date for <span className="text-slate-800">{selectedLead?.clientName}</span></p>
            
            <form onSubmit={(e) => { e.preventDefault(); submitAction('Scheduled', meetingDetails); }} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Meeting Date</label>
                <input required type="date" value={meetingDetails.date} onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-slate-50 text-slate-700 font-bold transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Meeting Time</label>
                <input required type="time" value={meetingDetails.time} onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-slate-50 text-slate-700 font-bold transition-all" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsMeetingModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2 transition-all shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                  {actionLoading ? <Loader2 size={20} className="animate-spin"/> : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CallingDashboard;