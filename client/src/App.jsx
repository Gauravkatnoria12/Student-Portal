import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Users, User, LogOut, Search, 
  TrendingUp, Calendar, CreditCard, ChevronRight,
  Menu, X, Lock, Fingerprint, Plus, Edit, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- COMPONENTS ---

const LoginPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/login`, { username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setAuth(res.data);
      navigate(res.data.role === 'admin' ? '/admin' : `/student/${res.data.username.replace(/\//g, '-')}`);
    } catch (err) {
      setError('Invalid Roll Number or Password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6a42c2]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#06b6d4]/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[440px] bg-gradient-to-b from-[#ffec3d] via-[#4ade80] to-[#06b6d4] rounded-[3.5rem] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10">
        <div className="bg-gradient-to-b from-[#ffec3d] via-[#4ade80] to-[#06b6d4] rounded-[3.4rem] p-8 lg:p-10 h-full">
          
          {/* Header Icon Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-black/10 blur-xl rounded-full scale-150"></div>
              <div className="w-28 h-28 bg-[#6a42c2] rounded-[2.5rem] flex items-center justify-center shadow-[0_15px_30px_rgba(106,66,194,0.4)] transform hover:rotate-6 transition-transform duration-500 relative z-10 border-4 border-white/20">
                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
                  <Fingerprint size={48} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-white text-4xl font-black mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
              CSE Batch 2024
            </h1>
            <div className="inline-block px-4 py-1 bg-black/10 backdrop-blur-md rounded-full border border-white/20">
              <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                Software Package Management
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-white/60 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Roll Number (701/24)"
                className="w-full bg-black/10 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:bg-black/20 focus:border-white/40 focus:ring-0 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-white/60 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Security Password"
                className="w-full bg-black/10 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:bg-black/20 focus:border-white/40 focus:ring-0 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/40 rounded-xl p-3 text-red-100 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full relative overflow-hidden bg-[#6a42c2] text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(106,66,194,0.3)] hover:shadow-[0_15px_30px_rgba(106,66,194,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-center px-6">
              Official Departmental Access Portal
            </p>
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children, user, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans selection:bg-[#6a42c2]/10">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-[#6a42c2] to-[#4c1d95] text-white w-72 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-500 ease-in-out z-40 shadow-[20px_0_60px_rgba(76,29,149,0.1)]`}>
        <div className="p-8">
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-inner">
            <div className="bg-white text-[#6a42c2] p-3 rounded-2xl shadow-[0_5px_15px_rgba(255,255,255,0.3)]">
              <Fingerprint size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none">CSE PORTAL</h2>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Batch 2024</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-8 px-6 space-y-3">
          {user.role === 'admin' ? (
            <>
              <Link to="/admin" className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-white/10 transition-all font-bold group relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <LayoutDashboard size={20} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-transform" /> 
                <span className="tracking-wide">Overview</span>
              </Link>
              <Link to="/admin/students" className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-white/10 transition-all font-bold group relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Users size={20} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-transform" /> 
                <span className="tracking-wide">Student Directory</span>
              </Link>
            </>
          ) : (
            <Link to={`/student/${user.username.replace(/\//g, '-')}`} className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-white/10 transition-all font-bold group relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <User size={20} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-transform" /> 
              <span className="tracking-wide">My Academic Profile</span>
            </Link>
          )}
          
          <div className="pt-12 mt-12 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-red-500/20 text-red-100 transition-all w-full text-left font-black group">
              <LogOut size={20} className="text-red-300 group-hover:scale-110 transition-transform" /> 
              <span className="tracking-widest uppercase text-xs">System Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 relative min-h-screen">
        {/* Animated Background Decor */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-[#6a42c2]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <header className="flex justify-between items-center mb-12 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-4 bg-white rounded-[1.5rem] shadow-xl border border-slate-100 text-[#6a42c2]">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6a42c2] rounded-xl flex items-center justify-center text-white">
              <Fingerprint size={20} />
            </div>
            <span className="font-black text-slate-800 tracking-tighter text-xl">CSE PORTAL</span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/stats`).then(res => setStats(res.data));
  }, []);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-[#6a42c2]/20 border-t-[#6a42c2] rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Assembling Dashboard...</p>
    </div>
  );

  const COLORS = ['#6a42c2', '#4ade80', '#06b6d4', '#facc15', '#f87171'];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Executive Overview</h2>
          <p className="text-slate-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></span>
            System Live: Academic Year 2024-25
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] shadow-xl border border-white">
          <div className="bg-[#6a42c2]/10 p-3 rounded-xl">
             <Calendar size={18} className="text-[#6a42c2]"/>
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Last Data Sync</p>
            <p className="text-sm font-bold text-slate-800">Just Now</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Registered Students', val: stats.totalStudents, sub: '70 Active Candidates', color: 'bg-white', text: 'text-[#6a42c2]', icon: <Users size={24}/> },
          { label: 'Attendance Average', val: `${Math.round(stats.averageAttendance)}%`, sub: 'Above 75% Threshold', color: 'bg-[#6a42c2]', text: 'text-white', icon: <TrendingUp size={24}/> },
          { label: 'Fee Compliance', val: '92%', sub: 'Verified Transactions', color: 'bg-white', text: 'text-[#4ade80]', icon: <CreditCard size={24}/> },
        ].map((card, i) => (
          <div key={i} className={`${card.color} p-10 rounded-[3rem] shadow-xl border border-white/50 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
            <div className={`absolute -right-4 -bottom-4 ${card.text} opacity-5 group-hover:scale-125 transition-transform duration-700`}>
              {card.icon}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${card.color === 'bg-white' ? 'text-slate-400' : 'text-white/60'}`}>{card.label}</p>
            <h3 className={`text-5xl font-black mb-3 tracking-tighter ${card.text}`}>{card.val}</h3>
            <p className={`text-xs font-bold ${card.color === 'bg-white' ? 'text-slate-500' : 'text-white/80'}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Category Pie Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative group">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
               <div className="w-2 h-2 bg-[#6a42c2] rounded-full"></div> Social Demographics
            </h4>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
               <Search size={14}/>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.categoryDistribution} 
                  dataKey="count" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  innerRadius={70} 
                  paddingAngle={8}
                  stroke="none"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'black', padding: '15px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            {stats.categoryDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:shadow-lg transition-all cursor-default">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{entry.category}</span>
                <span className="text-xs font-black text-slate-900">{entry.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Bar Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white relative group">
           <div className="flex justify-between items-center mb-10">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
               <div className="w-2 h-2 bg-[#4ade80] rounded-full"></div> Attendance Distribution
            </h4>
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
               <TrendingUp size={14}/>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryDistribution}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6a42c2" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#94a3b8' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#94a3b8' }} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc', radius: 20 }}
                   contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'black', padding: '15px' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[15, 15, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Metrics Portfolio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddStudentModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    roll_no: '', name: '', father_name: '', mother_name: '',
    mobile: '', reg_no: '', dob: '', gender: 'Male',
    category: 'GEN', religion: 'Hindu'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/students`, formData);
      onRefresh();
      onClose();
      setFormData({
        roll_no: '', name: '', father_name: '', mother_name: '',
        mobile: '', reg_no: '', dob: '', gender: 'Male',
        category: 'GEN', religion: 'Hindu'
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error adding student");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#6a42c2] text-white">
          <h3 className="text-xl font-black uppercase tracking-widest">Enroll New Student</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                {key.replace('_', ' ')}
              </label>
              {key === 'gender' ? (
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#6a42c2] outline-none"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              ) : (
                <input
                  type={key === 'dob' ? 'date' : 'text'}
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#6a42c2] outline-none"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  required
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6a42c2] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-[#6a42c2]/20 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditStudentModal = ({ isOpen, onClose, onRefresh, student }) => {
  const [formData, setFormData] = useState({
    roll_no: '', name: '', father_name: '', mother_name: '',
    mobile: '', reg_no: '', dob: '', gender: 'Male',
    category: 'GEN', religion: 'Hindu'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        roll_no: student.roll_no || '',
        name: student.name || '',
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        mobile: student.mobile || '',
        reg_no: student.reg_no || '',
        dob: student.dob || '',
        gender: student.gender || 'Male',
        category: student.category || 'GEN',
        religion: student.religion || 'Hindu'
      });
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/students/${student.roll_no}`, formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating student");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#4ade80] text-white">
          <h3 className="text-xl font-black uppercase tracking-widest">Edit Student Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                {key.replace('_', ' ')}
              </label>
              {key === 'gender' ? (
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#4ade80] outline-none"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              ) : (
                <input
                  type={key === 'dob' ? 'date' : 'text'}
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#4ade80] outline-none"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  required
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ade80] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-[#4ade80]/20 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = () => {
    axios.get(`${API_BASE}/students`).then(res => setStudents(res.data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (rollNo) => {
    if (window.confirm(`Are you sure you want to delete student ${rollNo}? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_BASE}/students/${rollNo}`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.error || "Error deleting student");
      }
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_no.includes(search)
  );

  return (
    <div className="space-y-8">
       <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 font-medium">Total registered candidates: {students.length}</p>
        </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name or roll number..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#6a42c2] outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-4 bg-[#6a42c2] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#5a32b2] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16}/> Add Student
            </button>
            <button className="flex-1 md:flex-none px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">Export CSV</button>
          </div>
        </div>
        <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchStudents} />
        <EditStudentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onRefresh={fetchStudents} student={selectedStudent} />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Roll No</th>
                <th className="px-8 py-5">Student Identity</th>
                <th className="px-8 py-5">Attendance Record</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.roll_no} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-black text-[#6a42c2]">{s.roll_no}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">{s.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">S/O {s.father_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full max-w-[120px] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${s.percentage < 75 ? 'bg-red-400' : 'bg-[#4ade80]'}`}
                          style={{ width: `${s.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-black text-slate-900">{Math.round(s.percentage)}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="inline-flex items-center gap-1 text-[#4ade80] bg-[#4ade80]/5 hover:bg-[#4ade80] hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.roll_no)}
                        className="inline-flex items-center gap-1 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                      <Link to={`/admin/students/${s.roll_no.replace(/\//g, '-')}`} className="inline-flex items-center gap-1 text-[#6a42c2] bg-[#6a42c2]/5 hover:bg-[#6a42c2] hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentDetail = () => {
  const [data, setData] = useState(null);
  const { rollNo } = useParams();

  const effectiveRollNo = rollNo || JSON.parse(localStorage.getItem('user'))?.username;

  useEffect(() => {
    if (effectiveRollNo) {
      const apiRollNo = effectiveRollNo.replace(/-/g, '/');
      axios.get(`${API_BASE}/students/${apiRollNo.replace(/\//g, '%2F')}`).then(res => setData(res.data));
    }
  }, [effectiveRollNo]);

  if (!data) return <div className="flex items-center justify-center h-full text-slate-400 font-bold animate-pulse">Retrieving Profile...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-20 -translate-y-20"></div>
        
        <div className="w-40 h-40 bg-gradient-to-br from-[#6a42c2] to-[#8b5cf6] rounded-[3rem] flex items-center justify-center text-white shadow-2xl relative z-10 rotate-3">
          <User size={80} strokeWidth={1.5} />
        </div>
        
        <div className="text-center md:text-left relative z-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{data.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <div className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Roll: {data.roll_no}</div>
             <div className="px-4 py-1.5 bg-[#6a42c2]/10 rounded-xl text-[10px] font-black text-[#6a42c2] uppercase tracking-widest">{data.category} Category</div>
             <div className="px-4 py-1.5 bg-[#4ade80]/10 rounded-xl text-[10px] font-black text-[#4ade80] uppercase tracking-widest">Active Status</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
               <Fingerprint size={16} className="text-[#6a42c2]"/> Identity Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { l: "Father's Name", v: data.father_name },
                { l: "Mother's Name", v: data.mother_name },
                { l: "Registered Mobile", v: data.mobile },
                { l: "Government Reg. No", v: data.reg_no },
                { l: "Date of Birth", v: data.dob },
                { l: "Faith & Ancestry", v: `${data.religion} / ${data.caste}` },
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#6a42c2] transition-colors">{item.l}</p>
                  <p className="font-bold text-slate-800">{item.v || 'Not Provided'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
               <CreditCard size={16} className="text-[#6a42c2]"/> Academic Ledger (Fees)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['sem1', 'sem2', 'sem3', 'sem4'].map((sem, i) => (
                <div key={sem} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Semester {i+1}</p>
                  <div className="text-sm font-black text-[#6a42c2] bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                    {data[sem] || 'CLEARED'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <h4 className="font-black text-slate-900 mb-10 uppercase tracking-[0.2em] text-[10px]">Attendance Pulse</h4>
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
                          strokeDasharray={502} strokeDashoffset={502 - (502 * data.percentage) / 100}
                          strokeLinecap="round"
                          className={`transition-all duration-1000 ${data.percentage < 75 ? 'text-red-400' : 'text-[#4ade80]'}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{Math.round(data.percentage)}%</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Status</span>
              </div>
            </div>
            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] w-full">
              <p className="text-[10px] font-bold text-slate-500 mb-3 uppercase">Lecture Breakdown</p>
              <div className="flex justify-between items-center px-2">
                 <div className="flex flex-col">
                   <span className="text-xl font-black text-slate-900">{data.attended_lectures}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase">Present</span>
                 </div>
                 <div className="w-[1px] h-8 bg-slate-200"></div>
                 <div className="flex flex-col">
                   <span className="text-xl font-black text-slate-900">{data.total_lectures}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase">Total</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-[#6a42c2] p-8 rounded-[2.5rem] shadow-xl shadow-[#6a42c2]/20 text-white relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
               <Fingerprint size={120}/>
             </div>
             <h5 className="font-black text-xs uppercase tracking-widest mb-4">Portal Info</h5>
             <p className="text-xs text-white/70 leading-relaxed font-medium">
               Your information is securely encrypted and managed by the Department of Computer Science & Engineering.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuth(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!auth ? <LoginPage setAuth={setAuth} /> : <Navigate to={auth.role === 'admin' ? '/admin' : `/student/${auth.username.replace(/\//g, '-')}`} />} />
        
        <Route path="/admin/*" element={
          auth?.role === 'admin' ? (
            <Layout user={auth} handleLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/:rollNo" element={<StudentDetail />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/student/:rollNo" element={
          auth ? (
            <Layout user={auth} handleLogout={handleLogout}>
              <StudentDetail />
            </Layout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
