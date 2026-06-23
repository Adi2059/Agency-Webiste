import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Calendar, PlayCircle, Code, Video, TrendingUp, CheckCircle, Mail, MapPin, Phone, MessageCircle, Server, Smartphone, Monitor, Database, Cloud, Share2, Search, ShoppingCart, Check, Laptop, ShoppingBag, Layout, Circle, FileCode2, Wind, Terminal, ServerCog, Sparkles, Rocket, RefreshCw, ShieldCheck, ChevronDown, ChevronUp, Star, Loader2, X } from 'lucide-react';

// CRM Imports
import LoginPage from './crm/pages/LoginPage';
import ProtectedRoute from './crm/components/ProtectedRoute';
import CallingDashboard from './crm/pages/CallingDashboard';
import SuperAdminDashboard from './crm/pages/SuperAdminDashboard';
import CofounderDashboard from './crm/pages/CofounderDashboard';

// ==========================================
// 1. PUBLIC WEBSITE COMPONENTS & PAGES
// ==========================================

const LinkedinIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
  
  const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isFading, setIsFading] = useState(false);
  
    useEffect(() => {
      const progressTimer = setTimeout(() => setProgress(100), 100);
      const fadeTimer = setTimeout(() => setIsFading(true), 2200);
      const removeTimer = setTimeout(() => onComplete(), 2800);
  
      return () => {
        clearTimeout(progressTimer);
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }, [onComplete]);
  
    return (
      <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A1128] transition-all duration-700 ease-in-out ${isFading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
           <div className="flex flex-col justify-center leading-none group mb-8 text-center">
              <span className="text-5xl md:text-7xl font-black text-white tracking-tight mb-2 drop-shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                AfterUS<span className="text-blue-500">.</span>
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-blue-400">
                Global Consultancy
              </span>
            </div>
            <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-blue-500 rounded-full transition-all ease-out" style={{ width: `${progress}%`, transitionDuration: '2000ms' }}></div>
            </div>
        </div>
      </div>
    );
  };
  
  const Navbar = ({ isScrolled, openModal }) => (
    <header className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
      isScrolled ? 'top-4 px-4 sm:px-6 pointer-events-none' : 'top-0 bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'max-w-5xl bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/50 rounded-full py-2.5 px-6 pointer-events-auto' 
          : 'max-w-7xl py-5 px-6 lg:px-8'
      }`}>
        <a href="#home" className="flex flex-col justify-center leading-none group">
          <span className={`font-black text-[#0A1128] tracking-tight mb-1 transition-all duration-500 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
            AfterUS<span className="text-blue-600">.</span>
          </span>
          <span className={`font-bold uppercase tracking-[0.25em] text-blue-600 transition-all duration-500 ${isScrolled ? 'text-[7px] md:text-[8px]' : 'text-[9px] md:text-[10px]'}`}>
            Global Consultancy
          </span>
        </a>
  
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Home</a>
          <a href="#services" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Services</a>
          <a href="#what-we-build" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Portfolio</a>
          <a href="#process" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Process</a>
          <a href="#packages" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Packages</a>
        </div>
  
        <button onClick={() => openModal('General Inquiry', '/assets/business.png')} className={`bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all flex items-center gap-2 ${isScrolled ? 'px-5 py-2 text-xs md:text-sm' : 'px-6 py-2.5 text-sm'}`}>
          <Calendar size={16} /> Book Demo
        </button>
      </div>
    </header>
  );
  
  const Footer = () => (
    <footer id="contact" className="bg-[#0A1128] pt-16 pb-8 border-t border-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <a href="#home" className="flex flex-col justify-center leading-none group mb-6">
              <span className="text-3xl font-black text-white tracking-tight mb-1.5">
                AfterUS<span className="text-blue-500">.</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                Global Consultancy
              </span>
            </a>
            <p className="text-blue-200/60 max-w-sm">
              We create powerful digital solutions that build your brand, engage your audience & drive real growth.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-blue-200/60 text-sm">
              <li><a href="#services" className="hover:text-blue-400 transition">Our Services</a></li>
              <li><a href="#team" className="hover:text-blue-400 transition">Our Team</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-3 text-blue-200/60 text-sm">
              <li className="hover:text-white transition cursor-pointer flex items-center gap-2"><Mail size={16}/> support@afterusglobal.com</li>
              <li className="hover:text-white transition cursor-pointer flex items-center gap-2"><Phone size={16}/> +91 9636792059</li>
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-1 flex-shrink-0"/> <span>Consultancy, Dehradun<br/>Uttarakhand</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-200/50">
          <p>© 2026 AfterUS Global Consultancy. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">LinkedIn</span>
            <span className="hover:text-white cursor-pointer transition">Twitter</span>
            <span className="hover:text-white cursor-pointer transition">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
  
  const FloatingActionButtons = () => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a href="tel:+919876543210" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        <Phone size={20} />
      </a>
      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        <MessageCircle size={24} />
      </a>
    </div>
  );
  
  // 🔥 HERO SECTION WAPAS PURANE WALE FORM KE SATH 🔥
  const HeroSection = () => {
    const [formState, setFormState] = useState('idle');
    const [formData, setFormData] = useState({ clientName: '', phoneNumber: '', serviceNeeded: 'Web & App Development' });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormState('submitting');
      try {
        await axios.post('https://agency-webiste-akqm.onrender.com/api/leads/add', formData);
        setFormState('success');
      } catch (error) {
        console.error("Error submitting form", error);
        alert("Failed to submit request. Please try again.");
        setFormState('idle');
      }
    };
  
    return (
      <section id="home" className="relative bg-[#0A1128] pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0A1128] to-indigo-900/20"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6 flex max-w-fit items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-900/30 backdrop-blur px-5 py-1.5 shadow-sm">
                <TrendingUp size={14} className="text-blue-400" />
                <p className="text-xs font-bold tracking-widest uppercase text-blue-100">Start Your Digital Journey</p>
              </div>
  
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
                Building Digital Experiences That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Drive Results.</span>
              </h1>
  
              <p className="text-lg leading-8 text-blue-100/70 mb-10 max-w-lg">
                Websites, Apps, Social Media & Digital Marketing Solutions. All Under One Roof. We manage your presence so you can focus on your business.
              </p>
  
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#packages" className="group flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-all">
                   View Packages <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#what-we-build" className="group flex items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                  <PlayCircle size={18} className="text-blue-400" /> Our Work
                </a>
              </div>
            </div>
  
            <div className="bg-white p-8 rounded-3xl shadow-2xl relative">
              <h3 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">Get In Touch</h3>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Grow Your Business</h2>
              <p className="text-sm text-slate-500 mb-6">Tell us your vision, we'll reply within 24 hours with a detailed proposal.</p>
              
              {formState === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center justify-center h-[280px]">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Project Brief Sent!</h3>
                  <p className="text-sm text-slate-600">Thank you. Our team will review your requirements and contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-slate-50" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                    <input required type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-slate-50" placeholder="+91 99999 99999" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Services Needed</label>
                    <select value={formData.serviceNeeded} onChange={e => setFormData({...formData, serviceNeeded: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 text-slate-600">
                      <option>Web & App Development</option>
                      <option>E-Commerce Solution</option>
                      <option>Social Media Management</option>
                      <option>Branding & SEO</option>
                    </select>
                  </div>
                  <button disabled={formState === 'submitting'} type="submit" className="w-full bg-[#0A1128] text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-all shadow-md mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {formState === 'submitting' ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <>Get Started <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  const TrustedBy = () => (
    <section className="border-b border-gray-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Trusted by forward-thinking brands</p>
        <div className="flex gap-8 md:gap-16 items-center flex-wrap justify-center font-black text-xl text-slate-400">
          <span>AcmeCorp</span>
          <span>GLOBAL<span className="text-blue-500">.</span></span>
          <span>Vertex</span>
          <span>StudioX</span>
          <span>Elevate</span>
        </div>
      </div>
    </section>
  );
  
  const Services = () => (
    <section id="services" className="w-full pt-24 pb-24 px-6 bg-slate-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Complete Digital Solutions</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] mb-6">Everything You Need To Grow</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">We integrate development, marketing, and design to provide a seamless growth ecosystem for your brand.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Monitor size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Web & App Development</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">Custom websites, dynamic web apps, and robust mobile applications built for high performance.</p>
          </div>
  
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <ShoppingCart size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">E-Commerce Solutions</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">End-to-end online store setups with payment gateways, inventory management, and fast checkout.</p>
          </div>
  
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
              <Share2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Social Media Management</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">Cinematic reels, content calendars, and data-driven strategies to explode your brand's reach.</p>
          </div>
  
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Branding & SEO</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">Search engine optimization, Google My Business setup, and cohesive brand identities.</p>
          </div>
        </div>
      </div>
    </section>
  );
  
  const WhatWeBuild = ({ openModal }) => {
    const [activeTab, setActiveTab] = useState('E-Commerce');
    const [imgError, setImgError] = useState(false);
  
    useEffect(() => { setImgError(false); }, [activeTab]);
  
    const categories = [
      {
        id: 'E-Commerce', title: 'E-COMMERCE STORES',
        features: ['High-converting stores with seamless checkout flows', 'Mobile-first layouts built to sell at any scale', 'Backend integrations for inventory, orders & customers'],
        tags: ['SHOPIFY', 'WOOCOMMERCE', 'CUSTOM CART', 'PAYMENT GATEWAYS'],
        buttonText: 'Build My Store', image: '/assets/ecommerce.png', serviceVal: 'E-Commerce Package'
      },
      {
        id: 'Business', title: 'BUSINESS & CORPORATE',
        features: ['Professional designs that build instant trust and authority', 'Fast-loading pages optimized for lead generation', 'Integrated CMS for easy content management'],
        tags: ['WORDPRESS', 'REACT', 'NEXT.JS', 'SEO OPTIMIZED'],
        buttonText: 'Build My Website', image: '/assets/business.png', serviceVal: 'Premium Package'
      },
      {
        id: 'SaaS / Apps', title: 'SAAS & WEB APPLICATIONS',
        features: ['Scalable architectures for complex data management', 'Secure user authentication and role-based access', 'Custom dashboard and analytics interfaces'],
        tags: ['MERN STACK', 'API INTEGRATION', 'DASHBOARDS', 'SECURE'],
        buttonText: 'Build My App', image: '/assets/saas.png', serviceVal: 'Custom Solution'
      }
    ];
  
    const activeContent = categories.find(cat => cat.id === activeTab) || categories[0];
  
    return (
      <section id="what-we-build" className="w-full pt-32 pb-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-gray-400"></div>
              <h2 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">What We Build</h2>
              <div className="h-[1px] w-8 bg-gray-400"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-4">
              Every Type of Website.<br />Built to Perfection.
            </h1>
          </div>
  
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-wrap border border-gray-200 rounded-xl overflow-hidden mb-12">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`flex-grow text-center py-4 px-6 text-sm font-bold transition-all duration-300 border-r border-gray-200 last:border-r-0 ${activeTab === cat.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-gray-50'}`}>
                  {cat.id}
                </button>
              ))}
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">{activeContent.title}</h2>
                <ul className="space-y-4 mb-8">
                  {activeContent.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 bg-slate-900 rounded flex items-center justify-center w-5 h-5 flex-shrink-0"><Check size={14} className="text-white" strokeWidth={3} /></div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 mb-10">
                  {activeContent.tags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 tracking-wider">{tag}</span>
                  ))}
                </div>
                {/* Pop up Trigger */}
                <button onClick={() => openModal(activeContent.serviceVal, activeContent.image)} className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg">
                  {activeContent.buttonText}
                </button>
              </div>
  
              <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-300 shadow-inner flex items-center justify-center overflow-hidden group p-6 pb-0">
                 <div className="relative w-full h-full bg-white rounded-t-lg shadow-2xl border-t border-l border-r border-gray-200 overflow-hidden flex flex-col">
                    <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-1.5 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 w-full bg-gray-50 overflow-hidden relative flex items-center justify-center">
                      {imgError ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-60">
                          <Laptop size={44} className="text-slate-300 mb-2" />
                          <p className="text-slate-500 font-black uppercase tracking-wider text-xs">Showcase Ready</p>
                        </div>
                      ) : (
                        <img src={activeContent.image} alt="Showcase" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" onError={() => setImgError(true)} />
                      )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  const TechStack = () => {
    const technologies = [
      { name: 'Shopify', icon: <ShoppingBag size={24} className="text-emerald-500" /> },
      { name: 'WordPress', icon: <Layout size={24} className="text-blue-500" /> },
      { name: 'Hostinger', icon: <Server size={24} className="text-purple-600" /> },
      { name: 'WooCommerce', icon: <ShoppingCart size={24} className="text-purple-500" /> },
      { name: 'React', icon: <Code size={24} className="text-cyan-400" /> },
      { name: 'Next.js', icon: <Circle size={24} className="text-slate-900 fill-slate-900" /> },
      { name: 'HTML5 / CSS3', icon: <FileCode2 size={24} className="text-orange-500" /> },
      { name: 'Tailwind CSS', icon: <Wind size={24} className="text-teal-400" /> },
      { name: 'Python / Flask', icon: <Terminal size={24} className="text-blue-600" /> },
      { name: 'Node.js / Express', icon: <ServerCog size={24} className="text-green-600" /> },
      { name: 'PostgreSQL / MySQL', icon: <Database size={24} className="text-blue-400" /> },
      { name: 'Cloud Deployment', icon: <Cloud size={24} className="text-orange-400" /> },
    ];
  
    return (
      <section className="w-full pt-24 pb-24 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gray-400"></div>
            <h2 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">Our Technology Arsenal</h2>
            <div className="h-[1px] w-8 bg-gray-400"></div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-6">We Work In Every Stack</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
            No platform lock-in, no single-technology bias. We choose the right tool for your project — from plug-and-play CMS solutions to fully custom-engineered systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {technologies.map((tech, index) => (
              <div key={index} className="flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
                {tech.icon}<span className="font-bold text-slate-800 text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  const Process = () => (
    <section id="process" className="w-full pt-32 pb-24 px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">How We Work</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] mb-6">A Process Designed for Success</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-indigo-100"></div>
          
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg ring-8 ring-white"><Search /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Discovery</h3>
            <p className="text-sm text-slate-600">We understand your brand, goals, and target audience to craft a tailored strategy.</p>
          </div>
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg ring-8 ring-white"><Sparkles /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. UI/UX Design</h3>
            <p className="text-sm text-slate-600">Creating wireframes and stunning visual designs that maximize user engagement.</p>
          </div>
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg ring-8 ring-white"><Code /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. Development</h3>
            <p className="text-sm text-slate-600">Writing clean, scalable, and secure code to bring your digital vision to life.</p>
          </div>
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg ring-8 ring-white"><Rocket /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">4. Launch & Scale</h3>
            <p className="text-sm text-slate-600">Testing rigorously and deploying globally, followed by growth marketing.</p>
          </div>
        </div>
      </div>
    </section>
  );
  
  const Founders = () => (
    <section id="team" className="w-full pt-32 pb-24 px-6 bg-[#0A1128] border-t border-blue-900/30">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-8 bg-blue-500/50"></div>
          <h2 className="text-xs font-bold text-blue-400 tracking-[0.2em] uppercase">The People Behind AfterUS</h2>
          <div className="h-[1px] w-8 bg-blue-500/50"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight mb-6">
          You Hire Us. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">You Actually Get Us.</span>
        </h1>
        <p className="text-lg text-blue-100/70 max-w-2xl mx-auto mb-20">
          No account managers, no offshore handoffs, no anonymous engineers. The team that pitches your project is the team that builds it.
        </p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-[#0d1633] border border-blue-900/50 rounded-[2rem] p-8 flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
              <div className="w-40 h-40 rounded-full bg-slate-800 mb-6 border-4 border-[#0A1128] shadow-xl overflow-hidden relative">
                <img src="/assets/Aditya.jpg" alt="Aditya Thakur" className="w-full h-fit object-cover grayscale group-hover:grayscale-0 transition-all duration-500 bg-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Co-Founder & Tech Lead</h3>
              <h2 className="text-3xl font-black text-white mb-6">Aditya Thakur</h2>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all"><LinkedinIcon size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 hover:bg-red-500 hover:text-white transition-all"><Mail size={18} /></a>
              </div>
            </div>
          </div>
  
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-[#0d1633] border border-blue-900/50 rounded-[2rem] p-8 flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
              <div className="w-40 h-40 rounded-full bg-slate-800 mb-6 border-4 border-[#0A1128] shadow-xl overflow-hidden relative">
                <img src="/assets/Dilkhush.jpeg" alt="Dilkhush Tiwari" className="w-full h-fit object-cover grayscale group-hover:grayscale-0 transition-all duration-500 bg-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Co-Founder & Creative Lead</h3>
              <h2 className="text-3xl font-black text-white mb-6">Dilkhush Tiwari</h2>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all"><LinkedinIcon size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 hover:bg-red-500 hover:text-white transition-all"><Mail size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  const Packages = ({ openModal }) => (
    <section id="packages" className="w-full pt-32 pb-24 px-6 bg-slate-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Transparent Pricing</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] mb-6">Choose Your Growth Path</h1>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border border-gray-200 rounded-3xl p-8 flex flex-col relative bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter Package</h3>
            <div className="text-3xl font-extrabold text-blue-600 mb-4">₹7,499</div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-green-500 flex-shrink-0"/> 5-Page Modern Website</li>
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-green-500 flex-shrink-0"/> 1-Year Free Domain & Hosting</li>
            </ul>
            <button onClick={() => openModal('Starter Package', '/assets/business.png')} className="w-full block text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200">Select Starter</button>
          </div>
  
          <div className="border-2 border-blue-600 rounded-3xl p-8 flex flex-col relative shadow-xl bg-white transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Most Popular</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Package</h3>
            <div className="text-3xl font-extrabold text-blue-600 mb-4">₹9,999</div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-blue-600 flex-shrink-0"/> Advanced Admin Panel</li>
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-blue-600 flex-shrink-0"/> Booking System Integration</li>
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-blue-600 flex-shrink-0"/> 2 Months Free Service</li>
            </ul>
            <button onClick={() => openModal('Premium Package', '/assets/business.png')} className="w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Select Premium</button>
          </div>
  
          <div className="border border-gray-200 rounded-3xl p-8 flex flex-col relative bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-2">E-Commerce</h3>
            <div className="text-3xl font-extrabold text-blue-600 mb-4">₹17,999</div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-green-500 flex-shrink-0"/> Up to 200 Products</li>
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-green-500 flex-shrink-0"/> Secure Payment Gateway</li>
            </ul>
            <button onClick={() => openModal('E-Commerce Package', '/assets/ecommerce.png')} className="w-full block text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200">Select E-Commerce</button>
          </div>
  
          <div className="border border-indigo-200 bg-indigo-50 rounded-3xl p-8 flex flex-col relative">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Social Growth</h3>
            <div className="text-3xl font-extrabold text-indigo-600 mb-4">₹10K-14K<span className="text-sm font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-indigo-600 flex-shrink-0"/> 20 to 30 Cinematic Reels</li>
              <li className="flex gap-3 text-sm text-slate-700"><CheckCircle size={18} className="text-indigo-600 flex-shrink-0"/> Strategy & Management</li>
            </ul>
            <button onClick={() => openModal('Social Media & Reels', '/assets/saas.png')} className="w-full block text-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Start Growing</button>
          </div>
        </div>
  
        <div className="mt-12 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">Enterprise</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Custom App & Web Solutions</h3>
            <p className="text-slate-600">Perfect for EdTech platforms, Web Apps, and complex custom ecosystems with Admin Panels.</p>
          </div>
          <div className="md:w-1/3 md:text-right">
            <button onClick={() => openModal('Custom Solution', '/assets/saas.png')} className="inline-block w-full md:w-auto text-center bg-[#0A1128] text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-600 shadow-xl">Discuss Your Project</button>
          </div>
        </div>
      </div>
    </section>
  );
  
  const Testimonials = () => (
    <section id="testimonials" className="w-full py-24 px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Client Success Stories</h2>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A1128] mb-4">Don't Just Take Our Word For It</h1>
          <p className="text-slate-600">Hear from the brands we've helped grow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 shadow-sm relative hover:-translate-y-1 transition-transform">
            <div className="flex text-yellow-400 mb-4">
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
            <p className="text-slate-700 italic mb-6 leading-relaxed">"AfterUS completely transformed our digital presence. The custom E-Commerce platform they built increased our conversions by 150% within the first month. Highly recommended!"</p>
            <div>
              <h4 className="font-bold text-slate-900">Rahul Sharma</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Founder, AcmeCorp</p>
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 shadow-sm relative hover:-translate-y-1 transition-transform">
            <div className="flex text-yellow-400 mb-4">
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
            <p className="text-slate-700 italic mb-6 leading-relaxed">"Their team doesn't just build websites; they build businesses. The social media growth strategy was spot on, and the cinematic reels went viral almost instantly."</p>
            <div>
              <h4 className="font-bold text-slate-900">Priya Verma</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Marketing Director, Vertex</p>
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 shadow-sm relative hover:-translate-y-1 transition-transform">
            <div className="flex text-yellow-400 mb-4">
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
            <p className="text-slate-700 italic mb-6 leading-relaxed">"Working directly with the founders made a huge difference. No miscommunication, fast delivery, and an admin panel that makes managing our EdTech app a breeze."</p>
            <div>
              <h4 className="font-bold text-slate-900">Aman Gupta</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">CEO, Elevate EdTech</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
      { q: "Do I get full ownership of my website/app's source code?", a: "Yes! Once the final payment is cleared, you get 100% ownership of your source code and intellectual property." },
      { q: "What happens after the 1-Year Free Hosting expires?", a: "After the first year, you can choose to renew your hosting with us at a nominal standard market rate, or easily migrate it to your own server." },
      { q: "How does the 'Free Maintenance' work?", a: "Our packages include 1 to 6 months of free technical support and bug fixes. After that, we charge a small monthly fee (₹1,499 - ₹1,999) to keep your site updated and secure." },
      { q: "Do you offer revisions during the design phase?", a: "Absolutely. We ensure you are 100% satisfied with the UI/UX mockups before we write a single line of code." }
    ];
  
    return (
      <section id="faq" className="w-full py-24 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0A1128] mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Clear answers for complete peace of mind.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center p-6 bg-white hover:bg-blue-50 transition text-left">
                  <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                  {openIndex === index ? <ChevronUp className="text-blue-600 flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
                </button>
                {openIndex === index && (
                  <div className="p-6 bg-slate-50 text-slate-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  // 🔥 PREMIUM BOOKING MODAL 🔥
  const BookingModal = ({ isOpen, onClose, defaultService, imagePath }) => {
    const [selectedService, setSelectedService] = useState(defaultService || 'Starter Package');
    const [formState, setFormState] = useState('idle');
    const [formData, setFormData] = useState({ clientName: '', phoneNumber: '' });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedService(defaultService);
            setImgError(false);
            setFormState('idle');
        }
    }, [isOpen, defaultService]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormState('submitting');
      try {
        await axios.post('https://agency-webiste-akqm.onrender.com/api/leads/add', {
            clientName: formData.clientName,
            phoneNumber: formData.phoneNumber,
            serviceNeeded: selectedService
        });
        setFormState('success');
      } catch(error) {
        console.error(error);
        alert("Failed to book demo. Please try again.");
        setFormState('idle');
      }
    };
    
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-3xl w-full max-w-5xl h-auto md:h-[600px] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
            <X size={20} />
          </button>

          <div className="hidden md:flex md:w-1/2 bg-[#0A1128] relative overflow-hidden flex-col justify-between p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent z-0"></div>
            
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-black text-white leading-tight mb-3">Let's build something <span className="text-blue-400">great together.</span></h2>
              <p className="text-blue-100/70 text-sm">You selected <span className="font-bold text-white">{selectedService}</span>. Drop your details and we'll get back to you with a solid execution plan.</p>
            </div>

            <div className="relative z-10 flex-1 w-full bg-slate-900 rounded-t-xl border-t border-l border-r border-slate-700 shadow-2xl overflow-hidden flex flex-col mt-4">
               <div className="h-6 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-1.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div><div className="w-2 h-2 rounded-full bg-amber-400"></div><div className="w-2 h-2 rounded-full bg-green-400"></div>
               </div>
               <div className="flex-1 w-full bg-slate-100 overflow-hidden relative flex items-center justify-center">
                  {imgError ? (
                    <div className="opacity-50 text-slate-500 text-center"><Laptop size={40} className="mx-auto mb-2"/><p className="text-[10px] uppercase font-bold tracking-widest">Showcase Ready</p></div>
                  ) : (
                    <img src={imagePath} alt="Showcase" className="w-full h-full object-cover object-top" onError={() => setImgError(true)} />
                  )}
               </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">Book Your Demo</h2>
            <h1 className="text-3xl font-extrabold text-[#0A1128] mb-8">Confirm Details</h1>
            
            {formState === 'success' ? (
               <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} /></div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                 <p className="text-sm text-slate-600">Our team will reach out to you within 24 hours.</p>
                 <button onClick={onClose} className="mt-6 text-sm font-bold text-blue-600 hover:underline">Close Window</button>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selected Package</h3>
                  <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border-2 border-blue-100 bg-blue-50/50 text-blue-700 font-bold focus:ring-0 focus:border-blue-500 outline-none transition-all cursor-pointer">
                    <option>Starter Package</option>
                    <option>Premium Package</option>
                    <option>E-Commerce Package</option>
                    <option>Social Media & Reels</option>
                    <option>Custom Solution</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</h3>
                    <input required type="text" value={formData.clientName} onChange={(e)=>setFormData({...formData, clientName: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 text-sm font-bold" placeholder="Your Name" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</h3>
                    <input required type="tel" value={formData.phoneNumber} onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 text-sm font-bold" placeholder="+91 9999999999"/>
                  </div>
                </div>
                
                <button disabled={formState === 'submitting'} type="submit" className="w-full bg-[#0A1128] text-white font-bold py-4 rounded-xl hover:bg-blue-600 flex justify-center items-center gap-2 transition-all shadow-lg mt-4 disabled:opacity-70">
                  {formState === 'submitting' ? <><Loader2 size={18} className="animate-spin"/> Processing...</> : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

// ==========================================
// PUBLIC WEBSITE WRAPPER
// ==========================================
const PublicWebsite = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [bookingModal, setBookingModal] = useState({
      isOpen: false,
      service: 'General Inquiry',
      imagePath: '/assets/business.png'
    });

    const openModal = (service = 'General Inquiry', imagePath = '/assets/business.png') => {
      setBookingModal({ isOpen: true, service, imagePath });
    };

    const closeModal = () => {
      setBookingModal({ ...bookingModal, isOpen: false });
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`min-h-screen bg-white font-sans text-slate-900 flex flex-col ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            
            <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <Navbar isScrolled={isScrolled} openModal={openModal} />
                <FloatingActionButtons />
            </div>
            
            <div className={`flex flex-col flex-grow transition-all duration-[1200ms] ease-out origin-top ${isLoading ? 'scale-[1.03] opacity-0 blur-sm' : 'opacity-100 blur-0'}`}>
                <main className="flex-grow">
                    <HeroSection />
                    <TrustedBy />
                    <Services />
                    <WhatWeBuild openModal={openModal} />
                    <TechStack />
                    <Process />
                    <Founders />
                    <Packages openModal={openModal} />
                    <Testimonials />
                    <FAQ />
                </main>
                <Footer />
            </div>

            <BookingModal 
              isOpen={bookingModal.isOpen} 
              onClose={closeModal} 
              defaultService={bookingModal.service} 
              imagePath={bookingModal.imagePath} 
            />
        </div>
    );
};

// ==========================================
// FINAL APP ROUTING
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicWebsite />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/calling-dashboard" element={<ProtectedRoute><CallingDashboard /></ProtectedRoute>} />
        <Route path="/cofounder-dashboard" element={<ProtectedRoute><CofounderDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}