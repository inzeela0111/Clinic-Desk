import { useState } from 'react';
import { useGetDashboardStatsQuery } from '../services/dashboardApi';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from '../services/appointmentsApi';
import { Users, Calendar as CalendarIcon, Stethoscope, ArrowUpRight, Plus, Activity, LayoutGrid, Clock, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../context/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-5 group hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} shadow-lg shadow-current/20`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const { user } = useSelector(state => state.auth);
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery(timeRange);
  const { data: apptData, isLoading: apptLoading } = user?.isAdmin 
    ? useGetAllAppointmentsQuery() 
    : useGetMyAppointmentsQuery();
  const { t } = useLanguage();

  if (statsLoading || apptLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-48 bg-slate-200 rounded-[2.5rem] mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  const stats = statsData?.data?.overview || {};
  const dailyStats = statsData?.data?.dailyStats || [];
  const todayAppointments = (statsData?.data?.todayAppointments || []).filter(appt => 
    user?.isAdmin ? true : (appt.userId?._id === user?._id || appt.userId === user?._id)
  );
  const allAppointments = (apptData?.data || []).filter(appt => 
    user?.isAdmin ? true : (appt.userId?._id === user?._id || appt.userId === user?._id)
  );

  // Pie Chart Data
  const statusCounts = { confirmed: 0, pending: 0, cancelled: 0 };
  allAppointments.forEach(a => {
    if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
  });
  
  const pieData = [
    { name: 'Confirmed', value: statusCounts.confirmed, color: '#3b82f6' }, // Blue
    { name: 'Pending', value: statusCounts.pending, color: '#f59e0b' },   // Amber
    { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' } // Red
  ];

  // Recent Activity Data
  const recentActivities = [...allAppointments]
    .sort((a, b) => new Date(b.createdAt || new Date()) < new Date(a.createdAt || new Date()) ? 1 : -1)
    .slice(0, 4);

  const getGreetingKey = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'goodMorning';
    if (hour >= 12 && hour < 17) return 'goodAfternoon';
    if (hour >= 17 && hour < 21) return 'goodEvening';
    return 'goodNight';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="relative z-10 max-w-lg">
          <p className="text-blue-200 text-[11px] font-bold mb-1 uppercase tracking-widest">
            {t('welcomeBack')}, {user?.name?.split(' ')[0]} 👋
          </p>
          <h2 className="text-xl sm:text-2xl font-black mb-1.5 tracking-tight leading-snug">
            {t(getGreetingKey())}
          </h2>
          <p className="text-blue-100 text-xs font-medium mb-4 max-w-sm leading-relaxed opacity-90">
            {user?.isAdmin 
              ? t('adminSubtext')
              : t('patientSubtext')
            }
          </p>
          <div className="flex flex-wrap items-center gap-3">
             <Link to="/smart-booking" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-black text-xs shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> {t('newBooking')}
             </Link>
             <Link to={user?.isAdmin ? "/admin" : "/reports"} className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> {t('quickView')}
             </Link>
          </div>
        </div>
        
        {/* Decorative Medical Illustration */}
        <div className="absolute right-6 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-end pointer-events-none">
            <div className="relative w-32 h-36">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl transform rotate-6 scale-105 mt-1 ml-2"></div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl flex flex-col p-3 transform -rotate-3">
                    <div className="w-1/3 h-1.5 bg-blue-100 rounded-full mb-3 mx-auto relative">
                       <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-2.5 bg-slate-200 rounded-t-sm"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-inner">
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3"></div>
                    <div className="w-2/3 h-1.5 bg-slate-100 rounded-full mt-1.5"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                    <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute top-1/3 -right-5 w-4 h-4 bg-emerald-400 rounded-full shadow-lg animate-pulse"></div>
            </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
            title={t('totalDoctors')}
            value={stats.totalDoctors || 0}
            icon={Stethoscope}
            colorClass="bg-blue-600 text-white"
            trend="+12%"
        />
        <StatCard
            title={t('activePatients')}
            value={stats.totalUsers || 0}
            icon={Users}
            colorClass="bg-purple-600 text-white"
            trend="+5%"
        />
        <StatCard
            title={t('totalAppointments')}
            value={stats.totalAppointments || 0}
            icon={CalendarIcon}
            colorClass="bg-amber-500 text-white"
            trend="+8%"
        />
        <StatCard
            title={t('activeSlots')}
            value={stats.totalSlots || 0}
            icon={LayoutGrid}
            colorClass="bg-emerald-500 text-white"
            trend="+15%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Charts & Schedule) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Appointments Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('appointmentsOverview')}</h3>
               </div>
               <select 
                   value={timeRange}
                   onChange={(e) => setTimeRange(e.target.value)}
                   className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300 outline-none"
               >
                   <option value="week">{t('thisWeek')}</option>
                   <option value="month">{t('thisMonth')}</option>
               </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dx={-10} />
                  <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Appointments" />
                  <Area type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConfirmed)" name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                     <CalendarIcon className="w-5 h-5 text-blue-500" />
                     <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t('todaysSchedule')}</h2>
                  </div>
                  <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {todayAppointments.length} {t('booked')}
                  </span>
              </div>
              <div className="overflow-y-auto max-h-[250px] pr-2 custom-scrollbar space-y-3">
                  {todayAppointments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-300 dark:text-slate-600">
                          <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                          <p className="font-bold text-sm">{t('noSessionsToday')}</p>
                      </div>
                  ) : (
                      todayAppointments.map((appt) => (
                      <div key={appt._id} className="group flex items-center p-3.5 rounded-2xl border border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-blue-100 dark:hover:border-blue-800 transition-all duration-300">
                          <div className="mr-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-600 p-2 rounded-xl text-center min-w-[55px]">
                              <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Time</div>
                              <div className="font-black text-blue-600 text-xs">{appt.time?.split(' - ')[0]}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="font-black text-slate-800 dark:text-white truncate text-sm">{appt.userId?.name || 'Unknown Patient'}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Dr. {appt.doctorId?.name}</span>
                              </div>
                          </div>
                      </div>
                      ))
                  )}
              </div>
          </div>
        </div>

        {/* Right Column (Status & Activity) */}
        <div className="space-y-6">
            
            {/* Appointment Status Donut */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('appointmentStatus')}</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-28 w-28 relative">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                innerRadius={35} 
                                outerRadius={50} 
                                paddingAngle={5} 
                                dataKey="value" 
                                stroke="none"
                            >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-black text-slate-800 dark:text-white">{allAppointments.length}</span>
                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t('total')}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {pieData.map(item => {
                            const percent = allAppointments.length ? Math.round((item.value / allAppointments.length) * 100) : 0;
                            return (
                                <div key={item.name} className="flex items-center gap-3 text-[11px] font-bold">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-500 dark:text-slate-400 w-16">{item.name}</span>
                                    <span className="text-slate-800 dark:text-white">{percent}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('recentActivity')}</h3>
                    </div>
                    <Link to="/appointments" className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">{t('viewAll')}</Link>
                </div>
                <div className="space-y-4">
                    {recentActivities.map(activity => (
                        <div key={activity._id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-900">
                                <Plus className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                    {t('newAppointment')} <span className="text-blue-600">#{activity._id?.slice(-4)}</span> {t('bookedWith')} Dr. {activity.doctorId?.name}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                    {activity.time} • {t('today')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <p className="text-[11px] font-bold text-slate-400 text-center py-4">{t('noRecentActivity')}</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
