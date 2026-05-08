import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { Stethoscope, Bell, Menu, Search as SearchIcon, User, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetDoctorsQuery } from '../../services/doctorsApi';
import { useGetPatientsQuery } from '../../services/dashboardApi';

const Layout = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Fetch data for search
  const { data: doctorsData } = useGetDoctorsQuery();
  const { data: patientsData } = useGetPatientsQuery(undefined, { skip: !user?.isAdmin });

  const doctors = doctorsData?.data || doctorsData || [];
  const patients = patientsData?.data || [];

  const filteredDoctors = searchQuery.length > 1 
    ? doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.speciality.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const filteredPatients = (user?.isAdmin && searchQuery.length > 1)
    ? patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const hasResults = filteredDoctors.length > 0 || filteredPatients.length > 0;

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Mobile Top Header (Classic with Logo) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        {/* Logo & Name - Left */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-blue-600 tracking-tight">ClinicDesk</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Notification - Top */}
          <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>

          {/* Hamburger - Right */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex-shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>


      {/* Sidebar - Desktop Fix & Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full transition-all duration-300">
        <Navbar />
        <main className="flex-1 px-4 pt-2 pb-8 lg:p-8 mt-16 lg:mt-0 mb-20 lg:mb-0 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onSearchClick={() => setIsSearchOpen(true)} />

      {/* Global Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-[70] animate-in fade-in duration-300 flex flex-col">
            <div className="h-16 flex items-center gap-4 px-6 border-b border-slate-100">
                <SearchIcon className="w-5 h-5 text-blue-600" />
                <input 
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctors, patients..."
                    className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300"
                />
                <button 
                    onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                    }}
                    className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl"
                >
                    Close
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {searchQuery.length <= 1 ? (
                    <div className="text-center py-20 text-slate-300">
                        <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold">Start typing to search...</p>
                    </div>
                ) : !hasResults ? (
                    <div className="text-center py-20 text-slate-300">
                        <p className="font-bold">No results found for "{searchQuery}"</p>
                    </div>
                ) : (
                    <>
                        {filteredDoctors.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Doctors</h3>
                                {filteredDoctors.map(doc => (
                                    <button 
                                        key={doc._id}
                                        onClick={() => {
                                            navigate(`/doctors/${doc._id}`);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-4 p-4 bg-slate-50/50 hover:bg-blue-50 rounded-[1.5rem] border border-slate-100 transition-all text-left"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                            <UserCheck className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-800 leading-tight">Dr. {doc.name}</p>
                                            <p className="text-xs text-blue-600 font-bold mt-0.5">{doc.speciality}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {filteredPatients.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patients</h3>
                                {filteredPatients.map(p => (
                                    <button 
                                        key={p._id}
                                        onClick={() => {
                                            navigate(`/admin/patients`, { state: { selectedPatientId: p._id } });
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-4 p-4 bg-slate-50/50 hover:bg-violet-50 rounded-[1.5rem] border border-slate-100 transition-all text-left"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-800 leading-tight">{p.name}</p>
                                            <p className="text-xs text-slate-400 font-bold mt-0.5">{p.email}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      )}

      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
