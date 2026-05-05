import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, Stethoscope, Calendar,
  BarChart2, ShieldCheck, Sparkles, Bell, X, User
} from 'lucide-react';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from '../../services/appointmentsApi';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const { data: adminData } = useGetAllAppointmentsQuery(undefined, { skip: !user?.isAdmin });
  const { data: myData } = useGetMyAppointmentsQuery(undefined, { skip: user?.isAdmin });
  const allAppointments = user?.isAdmin ? (adminData?.data || []) : (myData?.data || []);

  // Aaj aur kal ki date
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

  // Click outside close
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { name: 'Dashboard',     path: '/dashboard',     icon: LayoutDashboard },
    { name: 'Smart Booking', path: '/smart-booking', icon: Sparkles },
    { name: 'Appointments',  path: '/appointments',  icon: Calendar },
    { name: 'Doctors',       path: '/doctors',       icon: Stethoscope },
    { name: 'Reports',       path: '/reports',       icon: BarChart2 },
    { name: 'Notifications',  path: '/notifications',  icon: Bell },
  ];

  const statusStyle = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed top-0 left-0 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-blue-600">ClinicDesk</span>
        </div>

        {/* Bell */}
        <div className="relative" ref={bellRef}>
    
        </div>
      </div>

      {/* Nav Links */}
      <nav className="w-full flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
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
          </>
        )}
      </nav>

      {/* User badge */}
      {user && (
        <div className="p-4 border-t border-slate-100">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-2 -m-2 rounded-xl transition ${
                isActive ? 'bg-slate-100' : 'hover:bg-blue-200'
              }`
            }
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <span style={{ display: user?.image ? 'none' : 'flex' }} className="w-full h-full items-center justify-center">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-large font-semibold text-slate-900 truncate capitalize">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.isAdmin ? '🛡 Admin' : 'Patient'}</p>
            </div>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;