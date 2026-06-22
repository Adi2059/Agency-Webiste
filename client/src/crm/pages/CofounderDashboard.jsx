import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Target, Rocket, Map, TrendingUp, Briefcase, Search, LogOut, 
  Upload, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Calendar, 
  Clock, Zap, ShieldCheck, PieChart, IndianRupee, FileDown, Wallet, HandCoins, Pencil, Trash2, Layers, AlignLeft
} from 'lucide-react';

const CofounderDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('afterus_user') || '{}');
  
  // 🔥 4 TABS NOW: Strategy | Pipeline | Projects | Reports
  const [activeTab, setActiveTab] = useState('strategy');
  const [leads, setLeads] = useState([]);
  const [companyDocs, setCompanyDocs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const [pdfTitle, setPdfTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', phoneNumber: '', serviceNeeded: 'Starter Package' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [dealToClose, setDealToClose] = useState(null);
  const [paymentData, setPaymentData] = useState({ totalAmount: 0, receivedAmount: 0 });

  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [editPaymentData, setEditPaymentData] = useState({ totalAmount: 0, receivedAmount: 0 });

  // 🔥 NEW: PROJECT MANAGEMENT STATES 🔥
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectData, setProjectData] = useState({ phase: 'Kickoff / Planning', progress: 10 });

  const handleLogout = () => {
    localStorage.removeItem('afterus_token');
    localStorage.removeItem('afterus_user');
    navigate('/');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('afterus_token');
      const headers = { Authorization: `Bearer ${token}` };
      const [leadsRes, docsRes] = await Promise.all([
        axios.get('https://agency-webiste-akqm.onrender.com/api/leads/all', { headers }),
        axios.get('https://agency-webiste-akqm.onrender.com/api/leads/docs/all', { headers })
      ]);
      setLeads(leadsRes.data);
      setCompanyDocs(docsRes.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getEstimatedValue = (service) => {
    const rates = {
      'Starter Package': 7999, 'Premium Package': 14999, 'E-Commerce Package': 17999,
      'Social Media & Reels': 14000, 'Custom Solution': 20000, 'General Inquiry': 0,
      'Web & App Development': 14999, 'E-Commerce Solution': 17999, 'Social Media Management': 14000, 'Branding & SEO': 7999
    };
    return rates[service] || 0;
  };

  const scheduledMeetings = leads.filter(lead => lead.status === 'Scheduled');
  const closedDeals = leads.filter(lead => lead.status === 'Closed'); // Closed deals = Ongoing Projects
  const activePipelineLeads = leads.filter(lead => lead.status !== 'Closed' && lead.status !== 'Rejected' && lead.status !== 'Invalid');

  const totalPipelineValue = activePipelineLeads.reduce((sum, lead) => sum + getEstimatedValue(lead.serviceNeeded), 0);
  const totalMoneyCollected = closedDeals.reduce((sum, lead) => sum + (lead.paymentReceived || 0), 0);
  const totalMoneyPending = closedDeals.reduce((sum, lead) => sum + ((lead.totalDealValue || 0) - (lead.paymentReceived || 0)), 0);
  const totalRevenueGenerated = closedDeals.reduce((sum, lead) => sum + (lead.totalDealValue || 0), 0);

  const formatMoney = (amount) => amount.toLocaleString('en-IN');

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const submitDealClose = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`https://agency-webiste-akqm.onrender.com/api/leads/update-status/${dealToClose._id}`, {
        status: 'Closed',
        totalDealValue: paymentData.totalAmount,
        paymentReceived: paymentData.receivedAmount
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` } });
      showNotification(`🎉 Boom! Deal Closed with ${dealToClose.clientName}`);
      setIsPaymentModalOpen(false); setDealToClose(null); fetchData();
    } catch (error) {} finally { setIsSubmitting(false); }
  };

  const submitEditPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`https://agency-webiste-akqm.onrender.com/api/leads/update-status/${dealToEdit._id}`, {
        status: 'Closed', totalDealValue: editPaymentData.totalAmount, paymentReceived: editPaymentData.receivedAmount
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` } });
      showNotification(`✅ Ledger updated for ${dealToEdit.clientName}`);
      setIsEditPaymentModalOpen(false); setDealToEdit(null); fetchData();
    } catch (error) {} finally { setIsSubmitting(false); }
  };

  // 🔥 NEW: UPDATE PROJECT PROGRESS API CALL 🔥
  const submitProjectUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`https://agency-webiste-akqm.onrender.com/api/leads/update-status/${projectToEdit._id}`, {
        projectPhase: projectData.phase,
        projectProgress: projectData.progress
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` } });
      showNotification(`🚀 Project status updated for ${projectToEdit.clientName}`);
      setIsProjectModalOpen(false); setProjectToEdit(null); fetchData();
    } catch (error) { alert("Failed to update project"); } finally { setIsSubmitting(false); }
  };

  const handleRemoveDeal = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this deal from the ledger?")) return;
    try {
      await axios.delete(`https://agency-webiste-akqm.onrender.com/api/leads/delete/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('afterus_token')}` }});
      showNotification('🗑️ Deal permanently removed from ledger!');
      setIsEditPaymentModalOpen(false); setDealToEdit(null); fetchData();
    } catch (error) {}
  };

  const handlePdfUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadingDoc(true);
    const token = localStorage.getItem('afterus_token');
    const uploadData = new FormData();
    uploadData.append('pdfFile', selectedFile);
    uploadData.append('title', pdfTitle || selectedFile.name); 
    try {
      await axios.post('https://agency-webiste-akqm.onrender.com/api/leads/docs/upload', uploadData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      showNotification('📁 Document synced to Vault!');
      setPdfTitle(''); setSelectedFile(null);
      document.getElementById('real-pdf-picker').value = '';
    } catch (err) {} finally { setUploadingDoc(false); }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('https://agency-webiste-akqm.onrender.com/api/leads/add', formData);
      setIsModalOpen(false);
      setFormData({ clientName: '', phoneNumber: '', serviceNeeded: 'Starter Package' });
      showNotification('✅ Opportunity injected successfully!');
      fetchData();
    } catch (error) {} finally { setIsSubmitting(false); }
  };

  const handleBulkCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const leadsArray = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; 
        const columns = line.split(',');
        if (columns.length >= 2 && columns[0].trim() !== '') {
          leadsArray.push({
            clientName: columns[0].trim(), phoneNumber: columns[1].trim(),
            serviceNeeded: columns[2] ? columns[2].trim() : 'Starter Package' 
          });
        }
      }
      if (leadsArray.length === 0) { alert("No valid leads found!"); e.target.value = ''; return; }
      setLoading(true);
      try {
        const token = localStorage.getItem('afterus_token');
        const res = await axios.post('https://agency-webiste-akqm.onrender.com/api/leads/bulk-add', { leads: leadsArray }, { headers: { Authorization: `Bearer ${token}` } });
        showNotification(`🚀 ${res.data.message}`);
        setCurrentPage(1); fetchData(); 
      } catch (err) { alert("Failed to bulk upload."); } finally { setLoading(false); e.target.value = ''; }
    };
    reader.readAsText(file);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 size={44} className="animate-spin text-indigo-600 mb-4"/></div>
  );

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-sans overflow-hidden">
      
      {notification && (
        <div className="absolute top-10 right-1/2 translate-x-1/2 bg-[#0A1128] text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 z-50 animate-in slide-in-from-top-10 duration-300">
          <Rocket size={20} className="text-blue-400"/> {notification}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#0f172a] to-[#0A1128] text-white flex flex-col relative overflow-hidden hide-on-print">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="p-8 border-b border-white/5 relative z-10">
          <h1 className="text-2xl font-black tracking-tight">AfterUS<span className="text-indigo-400">.</span></h1>
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Command Center</p>
        </div>
        
        <nav className="flex-1 p-5 space-y-3 relative z-10">
          <button onClick={() => setActiveTab('strategy')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'strategy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Target size={18} /> Vision & Strategy</button>
          <button onClick={() => setActiveTab('pipeline')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pipeline' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Briefcase size={18} /> Growth Funnel</button>
          {/* 🔥 NEW PROJECTS TAB BUTTON 🔥 */}
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Layers size={18} /> Active Projects</button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><PieChart size={18} /> Accounts Ledger</button>
        </nav>
        <div className="p-5 relative z-10"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400"><LogOut size={18} /> Secure Logout</button></div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative" id="print-area">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-10 flex-shrink-0 z-10 hide-on-print">
          <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl w-96 border shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none w-full text-sm font-semibold" />
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right"><p className="text-sm font-black text-slate-900">{user.name || 'Co-Founder'}</p><p className="text-[10px] uppercase text-indigo-600 font-black">Strategy Head</p></div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black">C</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          
          {/* ========================================== */}
          {/* TAB 1: STRATEGY */}
          {/* ========================================== */}
          {activeTab === 'strategy' && (
            <div className="animate-in fade-in max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10"><div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Operations Overview</h2><p className="text-slate-500 font-semibold mt-2">Metrics generated dynamically from active leads and closed deals.</p></div></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp size={80}/></div><p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Active Pipeline Potential</p><h3 className="text-4xl font-black text-slate-900 flex items-center"><IndianRupee size={28} className="mr-1 mt-1"/> {formatMoney(totalPipelineValue)}</h3><div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-lg"><Briefcase size={14}/> {activePipelineLeads.length} Hot Leads</div></div>
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Target size={80}/></div><p className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Revenue Closed</p><h3 className="text-4xl font-black flex items-center"><IndianRupee size={28} className="mr-1 mt-1"/> {formatMoney(totalRevenueGenerated)}</h3><div className="mt-4 flex items-center gap-2 text-xs font-bold text-white bg-indigo-500/50 border border-indigo-400/50 w-fit px-3 py-1 rounded-lg"><HandCoins size={14}/> {closedDeals.length} Deals Cracked</div></div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Wallet size={80}/></div><p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Advance Collected</p><h3 className="text-4xl font-black text-emerald-600 flex items-center"><IndianRupee size={28} className="mr-1 mt-1"/> {formatMoney(totalMoneyCollected)}</h3><div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 w-fit px-3 py-1 rounded-lg">Balance Pending: ₹{formatMoney(totalMoneyPending)}</div></div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Calendar className="text-indigo-600" size={24}/> Upcoming Deal Meetings ({scheduledMeetings.length})</h3>
                {scheduledMeetings.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border text-slate-400 font-bold border-dashed"><Calendar size={48} className="mx-auto mb-4 opacity-50"/>No meetings scheduled right now.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledMeetings.map((mtg, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 p-6 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl border border-indigo-100">{mtg.clientName[0]}</div><div><h4 className="font-black text-slate-900 text-lg leading-tight">{mtg.clientName}</h4><p className="text-xs text-slate-500 font-bold mt-1">{mtg.serviceNeeded}</p></div></div>
                            <div className="bg-slate-50 border p-2 rounded-xl text-center shadow-sm"><p className="text-[9px] uppercase font-black text-slate-400 mb-0.5">Date Set</p><p className="text-sm font-black text-indigo-600">{mtg.meetingDate || 'TBD'}</p><p className="text-[10px] font-bold text-slate-500 mt-0.5">{mtg.meetingTime || '--:--'}</p></div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl mb-6"><p className="text-xs font-bold text-slate-500 flex justify-between"><span>Est. Revenue:</span> <span className="text-slate-900">₹{formatMoney(getEstimatedValue(mtg.serviceNeeded))}</span></p><p className="text-xs font-bold text-slate-500 flex justify-between mt-1.5"><span>Phone:</span> <span className="text-slate-900">{mtg.phoneNumber}</span></p></div>
                        </div>
                        <button onClick={() => { setDealToClose(mtg); setPaymentData({ totalAmount: getEstimatedValue(mtg.serviceNeeded), receivedAmount: 0 }); setIsPaymentModalOpen(true); }} className="w-full py-3.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white rounded-xl font-black text-sm transition-all flex justify-center items-center gap-2 shadow-sm">
                          <Wallet size={18}/> Close Deal & Record Payment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: PIPELINE (WITH BULK CSV) */}
          {/* ========================================== */}
          {activeTab === 'pipeline' && (
            <div className="animate-in fade-in max-w-7xl mx-auto hide-on-print">
               <div className="flex justify-between items-end mb-8">
                <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Growth Funnel</h2><p className="text-slate-500 font-semibold mt-2">Inject new leads into the operational funnel.</p></div>
                <div className="flex items-center gap-4">
                  <input type="file" id="csv-upload-input" accept=".csv" onChange={handleBulkCSVUpload} className="hidden" />
                  <label htmlFor="csv-upload-input" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-xl text-sm font-black hover:bg-slate-50 cursor-pointer shadow-sm"><Upload size={18} className="text-indigo-600"/> Bulk Upload (CSV)</label>
                  <button onClick={() => setIsModalOpen(true)} className="bg-[#0A1128] text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-600 shadow-lg">+ Inject Opportunity</button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-slate-50 text-xs font-black uppercase text-slate-400 border-b"><th className="p-6">Client Identity</th><th className="p-6">Requirement</th><th className="p-6 text-right">Est. Value</th><th className="p-6">Status</th></tr></thead>
                  <tbody className="text-sm">
                    {currentLeads.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No leads in the pipeline. Start injecting.</td></tr>
                    ) : (
                      currentLeads.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50/50">
                          <td className="p-6 font-black text-slate-900">{row.clientName}</td>
                          <td className="p-6 text-slate-600 font-semibold">{row.serviceNeeded}</td>
                          <td className="p-6 text-slate-500 font-black text-right">₹{formatMoney(getEstimatedValue(row.serviceNeeded))}</td>
                          <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${row.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{row.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* 🔥 TAB 3: ACTIVE PROJECTS (NEW SECTION) 🔥 */}
          {/* ========================================== */}
          {activeTab === 'projects' && (
            <div className="animate-in fade-in max-w-7xl mx-auto hide-on-print">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Projects Engine</h2>
                  <p className="text-slate-500 font-semibold mt-2">Manage execution phases for closed clients.</p>
                </div>
              </div>

              {closedDeals.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border text-slate-400 font-bold shadow-sm">
                  <Layers size={64} className="mx-auto mb-4 opacity-30 text-indigo-600"/>
                  No active projects currently running. Close a deal to start execution!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {closedDeals.map((proj, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{proj.serviceNeeded}</p>
                          <h4 className="font-black text-slate-900 text-xl">{proj.clientName}</h4>
                        </div>
                        <button 
                          onClick={() => {
                            setProjectToEdit(proj);
                            setProjectData({ phase: proj.projectPhase || 'Kickoff / Planning', progress: proj.projectProgress || 10 });
                            setIsProjectModalOpen(true);
                          }}
                          className="bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2.5 rounded-xl transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-2">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-500">Current Phase</span>
                          <span className="text-xs font-black text-slate-800 bg-white px-2 py-1 rounded border shadow-sm">{proj.projectPhase || 'Kickoff'}</span>
                        </div>
                        
                        <div className="mb-2 flex justify-between items-center text-xs font-black">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-indigo-600">{proj.projectProgress || 10}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]" style={{ width: `${proj.projectProgress || 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: ACCOUNTS LEDGER */}
          {/* ========================================== */}
          {activeTab === 'reports' && (
            <div className="animate-in fade-in max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-8 hide-on-print">
                <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Accounts & Receivables</h2><p className="text-slate-500 font-semibold mt-2">Track advances collected, update payments, or remove cleared ledgers.</p></div>
                <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700"><FileDown size={18}/> Download Ledger PDF</button>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 print-friendly">
                <div className="text-center mb-10 pb-10 border-b border-slate-100"><h1 className="text-4xl font-black text-[#0A1128] tracking-tight">AfterUS<span className="text-indigo-600">.</span></h1><p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Official Financial Ledger</p></div>
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><Briefcase size={20}/> Closed Clients Ledger</h3>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-100 mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                        <th className="p-5">Client Identity</th><th className="p-5">Service Rendered</th><th className="p-5 text-right">Total Deal</th><th className="p-5 text-right text-emerald-600">Received</th><th className="p-5 text-right text-red-500">Pending</th><th className="p-5 text-center hide-on-print">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {closedDeals.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-400 font-bold">No deals closed yet.</td></tr>
                      ) : (
                        closedDeals.map((mtg, idx) => {
                          const total = mtg.totalDealValue || 0;
                          const rcvd = mtg.paymentReceived || 0;
                          const pending = total - rcvd;
                          const isFullyPaid = pending <= 0;

                          return (
                            <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="p-5 font-black text-slate-900">{mtg.clientName}</td>
                              <td className="p-5 text-slate-600 font-semibold">{mtg.serviceNeeded}</td>
                              <td className="p-5 font-black text-slate-700 text-right">₹{formatMoney(total)}</td>
                              <td className="p-5 font-black text-emerald-600 text-right bg-emerald-50/30">₹{formatMoney(rcvd)}</td>
                              <td className="p-5 font-black text-right bg-red-50/30">
                                {isFullyPaid ? <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider">Cleared</span> : <span className="text-red-500">₹{formatMoney(pending)}</span>}
                              </td>
                              <td className="p-5 text-center hide-on-print">
                                <button onClick={() => { setDealToEdit(mtg); setEditPaymentData({ totalAmount: total, receivedAmount: rcvd }); setIsEditPaymentModalOpen(true); }} className="p-2 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"><Pencil size={16} /></button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td colSpan="2" className="p-5 font-black text-right text-slate-900">GRAND TOTALS:</td>
                        <td className="p-5 font-black text-slate-900 text-right text-lg">₹{formatMoney(totalRevenueGenerated)}</td>
                        <td className="p-5 font-black text-emerald-600 text-right text-lg bg-emerald-50/50">₹{formatMoney(totalMoneyCollected)}</td>
                        <td className="p-5 font-black text-red-500 text-right text-lg bg-red-50/50">₹{formatMoney(totalMoneyPending)}</td><td className="hide-on-print"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 🔥 MODALS 🔥 */}
        {/* ========================================== */}
        
        {/* INJECT LEAD */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-[2rem] w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2"><Rocket size={24} className="text-indigo-600"/> Inject New Lead</h2>
              <form onSubmit={handleAddLead} className="space-y-5 mt-6">
                <input required type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full px-5 py-4 rounded-xl border outline-none bg-slate-50 text-slate-800 font-bold" placeholder="Client Name" />
                <input required type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-5 py-4 rounded-xl border outline-none bg-slate-50 text-slate-800 font-bold" placeholder="Phone Number" />
                <select value={formData.serviceNeeded} onChange={(e) => setFormData({...formData, serviceNeeded: e.target.value})} className="w-full px-5 py-4 rounded-xl border outline-none bg-slate-50 text-slate-800 font-bold">
                  <option>Starter Package</option><option>Premium Package</option><option>E-Commerce Package</option><option>Social Media & Reels</option><option>Custom Solution</option><option>General Inquiry</option>
                </select>
                <div className="flex gap-4 pt-6"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 font-black py-4 rounded-xl">Abort</button><button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl">{isSubmitting ? <Loader2 className="animate-spin"/> : 'Inject'}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* CLOSE DEAL */}
        {isPaymentModalOpen && dealToClose && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><HandCoins size={32} /></div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Close the Deal!</h2>
              <form onSubmit={submitDealClose} className="space-y-6 mt-6">
                <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Final Deal Value (₹)</label><input required type="number" value={paymentData.totalAmount} onChange={(e) => setPaymentData({...paymentData, totalAmount: Number(e.target.value)})} className="w-full px-5 py-4 rounded-xl border bg-slate-50 font-black text-xl" /></div>
                <div><label className="block text-[10px] font-black text-emerald-600 uppercase mb-2">Advance Received (₹)</label><input required type="number" value={paymentData.receivedAmount} onChange={(e) => setPaymentData({...paymentData, receivedAmount: Number(e.target.value)})} className="w-full px-5 py-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-black text-xl" /></div>
                <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 bg-white border font-black py-4 rounded-xl">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-xl">{isSubmitting ? <Loader2 className="animate-spin"/> : 'Confirm'}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PAYMENT */}
        {isEditPaymentModalOpen && dealToEdit && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-start mb-6"><div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Pencil size={32} /></div><button onClick={() => handleRemoveDeal(dealToEdit._id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-colors flex items-center gap-2 text-xs font-black uppercase"><Trash2 size={16}/> Remove</button></div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Update Ledger</h2>
              <form onSubmit={submitEditPayment} className="space-y-6 mt-6">
                <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Total Deal Value (₹)</label><input required type="number" value={editPaymentData.totalAmount} onChange={(e) => setEditPaymentData({...editPaymentData, totalAmount: Number(e.target.value)})} className="w-full px-5 py-4 rounded-xl border bg-slate-50 font-black text-xl" /></div>
                <div><label className="block text-[10px] font-black text-emerald-600 uppercase mb-2">Total Received (₹)</label><input required type="number" value={editPaymentData.receivedAmount} onChange={(e) => setEditPaymentData({...editPaymentData, receivedAmount: Number(e.target.value)})} className="w-full px-5 py-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-black text-xl" /></div>
                <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsEditPaymentModalOpen(false)} className="flex-1 bg-white border font-black py-4 rounded-xl">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl">{isSubmitting ? <Loader2 className="animate-spin"/> : 'Save Changes'}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* 🔥 NEW: EDIT PROJECT STATUS MODAL 🔥 */}
        {isProjectModalOpen && projectToEdit && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><AlignLeft size={32} /></div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Update Project Phase</h2>
              <p className="text-slate-500 text-sm font-semibold mb-6">Updating execution progress for <span className="text-indigo-600 font-black">{projectToEdit.clientName}</span>.</p>
              
              <form onSubmit={submitProjectUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Current Phase</label>
                  <select value={projectData.phase} onChange={(e) => setProjectData({...projectData, phase: e.target.value})} className="w-full px-5 py-4 rounded-xl border bg-slate-50 font-bold outline-none focus:ring-2 ring-indigo-200">
                    <option>Kickoff / Planning</option>
                    <option>UI/UX Design</option>
                    <option>Development</option>
                    <option>QA & Testing</option>
                    <option>Final Delivery / Live</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-600 uppercase mb-2 flex justify-between">
                    <span>Overall Progress</span>
                    <span>{projectData.progress}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={projectData.progress} onChange={(e) => setProjectData({...projectData, progress: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 bg-white border text-slate-600 font-black py-4 rounded-xl">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-500">{isSubmitting ? <Loader2 className="animate-spin"/> : 'Update Progress'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `@media print { .hide-on-print { display: none !important; } body { background: white; } .print-friendly { border: none !important; box-shadow: none !important; } }`}} />
      </main>
    </div>
  );
};

export default CofounderDashboard;