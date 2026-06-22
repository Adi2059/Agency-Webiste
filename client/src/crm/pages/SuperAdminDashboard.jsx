import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Users, PhoneCall, Phone, Settings, LogOut, TrendingUp, 
  Briefcase, CalendarCheck, Bell, Search, ChevronRight, ChevronLeft, Loader2, 
  Mail, MoreVertical, Pencil, Upload, FolderLock, Layers, FileText, Download, HandCoins, IndianRupee, Trash2
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('afterus_user') || '{}');
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [teamList, setTeamList] = useState([]);
  const [allLeads, setAllLeads] = useState([]); 
  const [companyDocs, setCompanyDocs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10; 

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', phoneNumber: '', serviceNeeded: 'Starter Package' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamFormData, setTeamFormData] = useState({ id: '', name: '', email: '', password: '', role: 'telecaller' });

  // 🔥 NEW: LEADS DELETE & SELECTION STATES 🔥
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔥 NEW: SUPERADMIN VAULT UPLOAD STATES 🔥
  const [pdfTitle, setPdfTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('afterus_token');
    localStorage.removeItem('afterus_user');
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('afterus_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [dashRes, teamRes, allLeadsRes, docsRes] = await Promise.all([
        axios.get('https://agency-webiste-akqm.onrender.com//api/leads/dashboard-data', { headers }),
        axios.get('https://agency-webiste-akqm.onrender.com//api/leads/team', { headers }),
        axios.get('https://agency-webiste-akqm.onrender.com//api/leads/all', { headers }),
        axios.get('https://agency-webiste-akqm.onrender.com//api/leads/docs/all', { headers })
      ]);
      
      setDashboardData(dashRes.data);
      setTeamList(teamRes.data);
      setAllLeads(allLeadsRes.data); 
      setCompanyDocs(docsRes.data); 
    } catch (err) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const closedDeals = allLeads.filter(lead => lead.status === 'Closed');
  const totalRevenueGenerated = closedDeals.reduce((sum, lead) => sum + (lead.totalDealValue || 0), 0);
  const formatMoney = (amount) => amount.toLocaleString('en-IN');

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = allLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(allLeads.length / leadsPerPage);

  const handleAddLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('https://agency-webiste-akqm.onrender.com//api/leads/add', formData);
      setIsModalOpen(false);
      setFormData({ clientName: '', phoneNumber: '', serviceNeeded: 'Starter Package' });
      fetchData();
    } catch (error) { alert("Error adding lead!"); } 
    finally { setIsSubmitting(false); }
  };

  // 🔥 MULTI-SELECT CHECKBOX LOGIC 🔥
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(currentLeads.map(lead => lead._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  // 🔥 DELETE SINGLE LEAD LOGIC 🔥
  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem('afterus_token');
      await axios.delete(`https://agency-webiste-akqm.onrender.com//api/leads/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Failed to delete lead.");
    }
  };

  // 🔥 BULK DELETE LEADS LOGIC 🔥
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedLeads.length} selected leads?`)) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('afterus_token');
      // Ek sath sabhi selected IDs ko delete API par bhejna
      await Promise.all(selectedLeads.map(id => 
        axios.delete(`https://agency-webiste-akqm.onrender.com//api/leads/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      setSelectedLeads([]); // Clear selection after delete
      fetchData(); // Refresh Data
    } catch (error) {
      alert("Error occurred while deleting leads.");
    } finally {
      setIsDeleting(false);
    }
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
            clientName: columns[0].trim(),
            phoneNumber: columns[1].trim(),
            serviceNeeded: columns[2] ? columns[2].trim() : 'Starter Package' 
          });
        }
      }

      if (leadsArray.length === 0) {
        alert("No valid leads found! Make sure the CSV has 'Name' and 'Phone' columns.");
        e.target.value = ''; return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('afterus_token');
        const res = await axios.post('https://agency-webiste-akqm.onrender.com//api/leads/bulk-add', 
          { leads: leadsArray }, { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        setCurrentPage(1); 
        fetchData(); 
      } catch (err) { alert("Failed to bulk upload leads."); } 
      finally { setLoading(false); e.target.value = ''; }
    };
    reader.readAsText(file);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('afterus_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (isEditingTeam) {
       await axios.put(`https://agency-webiste-akqm.onrender.com//api/leads/team/edit/${teamFormData.id}`, {
          name: teamFormData.name, 
          email: teamFormData.email, 
          role: teamFormData.role,
          password: teamFormData.password // Naya password backend ko bhejna
        }, { headers });
      } else {
        await axios.post('https://agency-webiste-akqm.onrender.com//api/leads/team/add', teamFormData, { headers });
      }
      setIsTeamModalOpen(false);
      fetchData();
    } catch (error) { alert(error.response?.data?.error || "Error processing request"); } 
    finally { setIsSubmitting(false); }
  };

  const openAddTeamModal = () => {
    setIsEditingTeam(false);
    setTeamFormData({ id: '', name: '', email: '', password: '', role: 'telecaller' });
    setIsTeamModalOpen(true);
  };

  const openEditTeamModal = (member) => {
    setIsEditingTeam(true);
    setTeamFormData({ id: member._id, name: member.name, email: member.email, password: '', role: member.role });
    setIsTeamModalOpen(true);
  };

  // 🔥 SUPER ADMIN PDF UPLOAD LOGIC 🔥
  const handleAdminPdfUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { alert("Please select a PDF file first!"); return; }
    setUploadingDoc(true);
    const token = localStorage.getItem('afterus_token');
    
    const uploadData = new FormData();
    uploadData.append('pdfFile', selectedFile);
    uploadData.append('title', pdfTitle || selectedFile.name); 

    try {
      await axios.post('https://agency-webiste-akqm.onrender.com//api/leads/docs/upload', uploadData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('📁 Document added to Company Vault!');
      setPdfTitle(''); setSelectedFile(null);
      document.getElementById('superadmin-pdf-picker').value = '';
      fetchData(); 
    } catch (err) { alert("Upload failed."); } 
    finally { setUploadingDoc(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 font-bold">Processing Agency Database...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', value: '₹' + formatMoney(totalRevenueGenerated), icon: <HandCoins size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Leads', value: dashboardData?.stats.totalLeads || 0, icon: <Briefcase size={20} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Meetings Set', value: dashboardData?.stats.meetingsSet || 0, icon: <CalendarCheck size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Callers', value: dashboardData?.stats.activeCallers || 0, icon: <PhoneCall size={20} />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Conversion Rate', value: dashboardData?.stats.conversionRate || '0%', icon: <TrendingUp size={20} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1128] text-white flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tight">AfterUS<span className="text-blue-500">.</span></h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Briefcase size={18} /> Lead Pipeline</button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Layers size={18} /> Co-founder Projects</button>
          <button onClick={() => setActiveTab('vault')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'vault' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><FolderLock size={18} /> Company Vault</button>
          <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'team' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Users size={18} /> Team Management</button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full w-96 border border-gray-200">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.name || 'Super Admin'}</p>
              <p className="text-[10px] uppercase text-blue-600 font-bold tracking-widest">Founder</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">{user.name ? user.name[0] : 'A'}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8"><h2 className="text-2xl font-black text-slate-900">Welcome back, Chief! 🚀</h2><p className="text-slate-500 text-sm mt-1">Live updates from your database terminal.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p><h3 className="text-xl font-black text-slate-900 truncate">{stat.value}</h3></div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-slate-900">Recent Lead Activity</h3><button onClick={() => setActiveTab('leads')} className="text-blue-600 text-sm font-bold hover:underline">View Full Pipeline →</button></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-gray-100"><th className="p-4 font-bold">Client Name</th><th className="p-4 font-bold">Service Required</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold">Assigned Caller</th></tr></thead>
                    <tbody className="text-sm">
                      {dashboardData?.recentLeads.length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No leads in database yet.</td></tr>
                      ) : (
                        dashboardData?.recentLeads.map((row, index) => (
                          <tr key={index} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{row.clientName}</td>
                            <td className="p-4 text-slate-600">{row.serviceNeeded}</td>
                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'Scheduled' ? 'bg-green-100 text-green-700' : row.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{row.status}</span></td>
                            <td className="p-4 text-slate-600">{row.assignedTo?.name || 'Unassigned'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* 🔥 TAB 2: FULL LEAD PIPELINE (WITH DELETE) 🔥 */}
          {/* ========================================== */}
          {activeTab === 'leads' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Lead Pipeline</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage all {allLeads.length} incoming inquiries here.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* BULK DELETE BUTTON */}
                  {selectedLeads.length > 0 && (
                    <button 
                      onClick={handleBulkDelete} 
                      disabled={isDeleting}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                      Delete Selected ({selectedLeads.length})
                    </button>
                  )}

                  <input type="file" id="csv-upload-input" accept=".csv" onChange={handleBulkCSVUpload} className="hidden" />
                  <label htmlFor="csv-upload-input" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md cursor-pointer">
                    <Upload size={16}/> Bulk Upload (CSV)
                  </label>
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
                    + Add Single Lead
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-gray-100">
                        {/* SELECT ALL CHECKBOX */}
                        <th className="p-5 w-10">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            onChange={handleSelectAll}
                            checked={currentLeads.length > 0 && selectedLeads.length === currentLeads.length}
                          />
                        </th>
                        <th className="p-5 font-bold">Date</th>
                        <th className="p-5 font-bold">Client Name</th>
                        <th className="p-5 font-bold">Phone Number</th>
                        <th className="p-5 font-bold">Service Needed</th>
                        <th className="p-5 font-bold">Status</th>
                        <th className="p-5 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {currentLeads.length === 0 ? (
                        <tr><td colSpan="7" className="p-8 text-center text-slate-500 font-medium">Pipeline is empty.</td></tr>
                      ) : (
                        currentLeads.map((row, index) => (
                          <tr key={index} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                            {/* INDIVIDUAL ROW CHECKBOX */}
                            <td className="p-5">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                checked={selectedLeads.includes(row._id)}
                                onChange={() => handleSelectLead(row._id)}
                              />
                            </td>
                            <td className="p-5 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                            <td className="p-5 font-bold text-slate-900">{row.clientName}</td>
                            <td className="p-5 text-slate-600">{row.phoneNumber}</td>
                            <td className="p-5 text-slate-600">{row.serviceNeeded}</td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                                row.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 
                                row.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : 
                                row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                row.status === 'FollowUp' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>{row.status}</span>
                            </td>
                            <td className="p-5 text-center">
                              {/* SINGLE DELETE BUTTON */}
                              <button 
                                onClick={() => handleDeleteSingle(row._id)} 
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <p className="text-sm text-slate-500 font-medium">Showing <span className="font-bold text-slate-900">{indexOfFirstLead + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastLead, allLeads.length)}</span> of <span className="font-bold text-slate-900">{allLeads.length}</span> leads</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><ChevronLeft size={18} /></button>
                      <span className="text-sm font-bold text-slate-700 px-2">Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CO-FOUNDER PROJECTS (UNCHANGED) */}
          {activeTab === 'projects' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Co-founder Execution</h2>
                <p className="text-slate-500 text-sm mt-1">Live tracking of ongoing project phases updated by Co-founder.</p>
              </div>

              {closedDeals.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 text-slate-400 font-bold shadow-sm"><Layers size={48} className="mx-auto mb-4 opacity-30 text-blue-600"/>No active projects currently running.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {closedDeals.map((proj, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                      <div className="mb-4 mt-2"><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{proj.serviceNeeded}</p><h4 className="font-black text-slate-900 text-xl">{proj.clientName}</h4></div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-slate-500">Current Phase</span><span className="text-[10px] font-black uppercase text-slate-700 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">{proj.projectPhase || 'Kickoff'}</span></div>
                        <div className="mb-2 flex justify-between items-center text-xs font-black"><span className="text-slate-400">Progress Tracker</span><span className="text-blue-600">{proj.projectProgress || 10}%</span></div>
                        <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${proj.projectProgress || 10}%` }}></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 🔥 TAB 4: COMPANY VAULT (WITH ADMIN UPLOAD) 🔥 */}
          {/* ========================================== */}
          {activeTab === 'vault' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Company Vault</h2>
                  <p className="text-slate-500 text-sm mt-1">Review strategic PDFs & invoices or upload documents yourself.</p>
                </div>
              </div>

              {/* SUPER ADMIN PDF UPLOAD BAR */}
              <form onSubmit={handleAdminPdfUpload} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-end gap-4 mb-8">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Document Title (Optional)</label>
                  <input type="text" placeholder="e.g. Master Pitch Deck" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select PDF</label>
                  <input required type="file" id="superadmin-pdf-picker" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full text-xs font-bold text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer bg-slate-50 p-1.5 rounded-lg border border-gray-200" />
                </div>
                <button type="submit" disabled={uploadingDoc} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md h-[42px]">
                  {uploadingDoc ? <Loader2 size={16} className="animate-spin"/> : <><Upload size={16}/> Upload to Vault</>}
                </button>
              </form>

              {/* DOCUMENT GRID */}
              {companyDocs.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 text-slate-400 font-bold shadow-sm">
                  <FolderLock size={48} className="mx-auto text-slate-300 mb-4" />
                  No documents in the vault yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {companyDocs.map((doc) => (
                    <div key={doc._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-red-100 flex-shrink-0"><FileText size={20} /></div>
                        <div><h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight group-hover:text-blue-600">{doc.title}</h3><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{doc.fileSize}</p></div>
                      </div>
                      <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                        <div className="text-[10px]"><p className="text-slate-400 font-semibold uppercase">By</p><p className="text-slate-800 font-black">{doc.uploadedBy}</p></div>
                        <a href={doc.downloadUrl} target="_blank" rel="noreferrer" className="bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white p-2 rounded-lg border border-slate-200 hover:border-blue-600 transition-all flex items-center gap-1 text-xs font-bold"><Download size={14}/></a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TEAM MANAGEMENT (UNCHANGED) */}
          {activeTab === 'team' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <div><h2 className="text-2xl font-black text-slate-900">Agency Team</h2><p className="text-slate-500 text-sm mt-1">Manage your team members and roles.</p></div>
                <button onClick={openAddTeamModal} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md">+ Add Member</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamList.map((member) => (
                  <div key={member._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xl font-black shadow-sm">{member.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1"><h3 className="text-lg font-black text-slate-900">{member.name}</h3><p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1">{member.role}</p><div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium"><span className="flex items-center gap-1 text-green-600"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</span><span className="flex items-center gap-1"><Mail size={14}/> {member.email}</span></div></div>
                    <button onClick={() => openEditTeamModal(member)} className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all" title="Edit Member"><Pencil size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        {/* ADD SINGLE LEAD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Add New Lead</h2>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Client Name</label><input required type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50" /></div>
                <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label><input required type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50" /></div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Required</label>
                  <select value={formData.serviceNeeded} onChange={(e) => setFormData({...formData, serviceNeeded: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 font-bold">
                    <option>Starter Package</option><option>Premium Package</option><option>E-Commerce Package</option><option>Social Media & Reels</option><option>Custom Solution</option><option>General Inquiry</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 flex justify-center items-center">{isSubmitting ? <Loader2 size={18} className="animate-spin"/> : 'Save Lead'}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT TEAM MODAL */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-6">{isEditingTeam ? 'Edit Team Member' : 'Add New Member'}</h2>
              <form onSubmit={handleTeamSubmit} className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label><input required type="text" value={teamFormData.name} onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50" /></div>
                <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label><input required type="email" value={teamFormData.email} onChange={(e) => setTeamFormData({...teamFormData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50" /></div>
                {!isEditingTeam && (<div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label><input required minLength={6} type="password" value={teamFormData.password} onChange={(e) => setTeamFormData({...teamFormData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50" /></div>)}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role</label>
                  <select value={teamFormData.role} onChange={(e) => setTeamFormData({...teamFormData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 uppercase text-sm font-bold text-slate-600">
                    <option value="telecaller">Telecaller / Outreach</option><option value="admin">Admin / Co-Founder</option><option value="editor">Video Editor</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setIsTeamModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 bg-[#0A1128] text-white font-bold py-3 rounded-xl hover:bg-blue-600 flex justify-center items-center">{isSubmitting ? <Loader2 size={18} className="animate-spin"/> : (isEditingTeam ? 'Update Member' : 'Create Account')}</button></div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SuperAdminDashboard;