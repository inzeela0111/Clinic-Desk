import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  LayoutDashboard, Stethoscope, Calendar,
  BarChart2, ShieldCheck, Sparkles, Bell, X, User, Users, LogOut
} from 'lucide-react';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from '../../services/appointmentsApi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const { data: adminData } = useGetAllAppointmentsQuery(undefined, { skip: !user?.isAdmin });
  const { data: myData } = useGetMyAppointmentsQuery(undefined, { skip: user?.isAdmin });
  const allAppointments = user?.isAdmin ? (adminData?.data || []) : (myData?.data || []);

  // Dates for notification highlights
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const fmt = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = fmt(today);
  const tomorrowStr = fmt(tomorrow);

  const upcoming = allAppointments.filter(a =>
    (a.appointmentDate === todayStr || a.appointmentDate === tomorrowStr) &&
    a.status !== 'cancelled'
  );

  // Click outside close for notification bell (desktop logic)
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    if(window.innerWidth < 1024) onClose();
  };

  const links = [
    { name: 'Dashboard',     path: '/dashboard',     icon: LayoutDashboard },
    { name: 'Smart Booking', path: '/smart-booking', icon: Sparkles },
    { name: 'Appointments',  path: '/appointments',  icon: Calendar },
    { name: 'Doctors',       path: '/doctors',       icon: Stethoscope },
    { name: 'Reports',       path: '/reports',       icon: BarChart2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <aside className={`w-64 bg-white border-l border-slate-200 h-screen fixed top-0 right-0 flex flex-col z-50 transition-transform duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } lg:translate-x-0 lg:left-0 lg:right-auto lg:border-r lg:border-l-0 shadow-2xl lg:shadow-none`}>
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-blue-600">ClinicDesk</span>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-500'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{link.name}</span>
                {link.name === 'Notifications' && upcoming.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {upcoming.length}
                  </span>
                )}
              </NavLink>
            );
          })}

          {user?.isAdmin && (
            <>
              <div className="pt-3 pb-1 px-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin</p>
              </div>
              <NavLink
                to="/admin"
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Admin Panel</span>
              </NavLink>
              <NavLink
                to="/admin/patients"
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Patients</span>
              </NavLink>
            </>
          )}

            {/* Logout Button inside the list */}
            {user && (
                <div className="mt-10 px-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest group shadow-sm"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;