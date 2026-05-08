import { useGetDashboardStatsQuery } from '../services/dashboardApi';
import { Users, Calendar as CalendarIcon, ListOrdered, Stethoscope, ArrowUpRight, Plus, Activity, LayoutGrid } from 'lucide-react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-5 group hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} shadow-lg shadow-current/20`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-48 bg-slate-200 rounded-[2.5rem] mb-10"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-32 bg-slate-200 rounded-3xl shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           <div className="lg:col-span-2 h-80 bg-slate-200 rounded-[2.5rem]"></div>
           <div className="h-80 bg-slate-200 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md shadow-lg shadow-red-500/5">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-red-700 mb-2 tracking-tight">System Connection Error</h2>
          <p className="text-sm text-red-500">{error?.data?.message || 'Could not connect to server.'}</p>
        </div>
      </div>
    );
  }

  const stats = data?.data?.overview || {};
  const dailyStats = data?.data?.dailyStats || [];
  const todayAppointments = data?.data?.todayAppointments || [];

  return (
    <div className="space-y-6 lg:space-y-10 animate-fade-in pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">Welcome back, <br className="sm:hidden" /> {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
            {user?.isAdmin 
              ? "Manage your clinic, doctors and patients in one streamlined workspace."
              : "Book appointments, consult with top doctors, and manage your health records seamlessly."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
             <Link to="/smart-booking" className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">New Booking</Link>
             <Link to={user?.isAdmin ? "/admin" : "/reports"} className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">Quick View</Link>
          </div>
        </div>
        {/* Abstract Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-1/2 flex items-center justify-end p-6 pointer-events-none opacity-20 sm:opacity-40 overflow-hidden">
            <Stethoscope className="w-64 h-64 text-white -mr-16 -mb-16 transform rotate-12" />
        </div>
      </div>

      {/* Grid Overview */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Key Insights
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">Real-time Data</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
            title="Total Doctors"
            value={stats.totalDoctors || 0}
            icon={Stethoscope}
            colorClass="bg-blue-600 text-white"
            trend="+12%"
            />
            <StatCard
            title="Active Patients"
            value={stats.totalUsers || 0}
            icon={Users}
            colorClass="bg-purple-600 text-white"
            trend="+5%"
            />
            <StatCard
            title="Appointments"
            value={stats.totalAppointments || 0}
            icon={CalendarIcon}
            colorClass="bg-amber-500 text-white"
            trend="+8%"
            />
            <StatCard
            title="Active Slots"
            value={stats.totalSlots || 0}
            icon={LayoutGrid}
            colorClass="bg-emerald-500 text-white"
            trend="+15%"
            />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="lg:hidden">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" /> Quick Actions
        </h3>
        <div className="grid grid-cols-4 gap-4">
            {[
                { name: 'Doctors', icon: Stethoscope, path: '/doctors', color: 'bg-blue-50 text-blue-600' },
                { name: 'Appts', icon: CalendarIcon, path: '/appointments', color: 'bg-purple-50 text-purple-600' },
                { name: 'Patients', icon: Users, path: '/admin/patients', color: 'bg-emerald-50 text-emerald-600' },
                { name: 'Reports', icon: Activity, path: '/reports', color: 'bg-amber-50 text-amber-600' },
            ].map(action => (
                <Link key={action.name} to={action.path} className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color} shadow-sm border border-current/10`}>
                        <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{action.name}</span>
                </Link>
            ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
          <div className="flex items-center justify-between mb-10">
             <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Appointment Activity</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Weekly volume analysis</p>
             </div>
             <Link to="/appointments" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
                    dy={10} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={24} name="Total Appts" />
                <Bar dataKey="confirmed" fill="#10b981" radius={[12, 12, 0, 0]} barSize={24} name="Confirmed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden flex flex-col h-full max-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Today's List</h2>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{todayAppointments.length} Booked</span>
                </div>
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-4">
                    {todayAppointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                            <CalendarIcon className="w-16 h-16 mb-4 opacity-10" />
                            <p className="font-bold">No sessions today</p>
                        </div>
                    ) : (
                        todayAppointments.map((appt) => (
                        <div key={appt._id} className="group flex items-center p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 hover:border-blue-100 transition-all duration-300">
                            <div className="mr-4 bg-white shadow-sm border border-slate-100 p-2.5 rounded-2xl text-center min-w-[60px]">
                                <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Time</div>
                                <div className="font-black text-blue-600 text-xs">{appt.time?.split(' - ')[0]}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-800 truncate text-sm">{appt.userId?.name || 'Unknown Patient'}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Dr. {appt.doctorId?.name}</span>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default DashboardPage;
