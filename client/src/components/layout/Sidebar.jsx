import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  LayoutDashboard, Stethoscope, Calendar,
  BarChart2, ShieldCheck, Sparkles, Bell, X, User, Users, LogOut, ArrowRight, Sun, Moon, Languages, Settings, Zap
} from 'lucide-react';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from '../../services/appointmentsApi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, toggleLanguage } = useLanguage();

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
    { name: t('dashboard'),     path: '/dashboard',     icon: LayoutDashboard },
    { name: t('smartBooking'), path: '/smart-booking', icon: Sparkles },
    { name: t('appointments'),  path: '/appointments',  icon: Calendar },
    { name: t('doctors'),       path: '/doctors',       icon: Stethoscope },
    { name: t('reports'),       path: '/reports',       icon: BarChart2 },
    { name: t('notifications'), path: '/notifications', icon: Bell },
    { name: t('settingsTitle'), path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 h-[100dvh] fixed top-0 right-0 flex flex-col z-[100] transition-all duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } lg:translate-x-0 lg:left-0 lg:right-auto lg:border-r lg:border-l-0 shadow-2xl lg:shadow-none`}>
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-blue-600">ClinicDesk</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav Links - Scrollable */}
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
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-500'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{link.name}</span>
                {link.name === t('notifications') && upcoming.length > 0 && (
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
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('admin')}</p>
              </div>
              <NavLink
                to="/admin"
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-600'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{t('adminPanel')}</span>
              </NavLink>
              <NavLink
                to="/admin/patients"
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600'
                  }`
                }
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{t('patients')}</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Fixed Bottom Section */}
      {user && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
          {/* Profile Card - Clickable */}
          <div 
            onClick={() => { navigate('/profile'); if(window.innerWidth < 1024) onClose(); }}
            className="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100/50 dark:border-slate-700 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-slate-700 dark:hover:to-slate-700 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name || 'User'}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.isAdmin ? 'Admin' : 'Patient'}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest group shadow-sm"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('logout')}</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;