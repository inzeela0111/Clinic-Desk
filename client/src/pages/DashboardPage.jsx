import { useGetDashboardStatsQuery } from '../services/dashboardApi';
import { Users, Calendar as CalendarIcon, ListOrdered, Stethoscope } from 'lucide-react';
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

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-red-700 mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm text-red-500">{error?.data?.message || 'Could not connect to server. Make sure backend is running.'}</p>
          <p className="text-xs text-slate-400 mt-2">Status: {error?.status}</p>
        </div>
      </div>
    );
  }

  const stats = data?.data?.overview || {};
  const dailyStats = data?.data?.dailyStats || [];
  const todayAppointments = data?.data?.todayAppointments || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your clinic for today.</p>
        </div>
        <div className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg font-medium text-slate-700">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors || 0}
          icon={Users}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Active Patients"
          value={stats.totalUsers || 0}
          icon={Users}
          colorClass="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Appointments (All time)"
          value={stats.totalAppointments || 0}
          icon={CalendarIcon}
          colorClass="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Active Slots"
          value={stats.totalSlots || 0}
          icon={ListOrdered}
          colorClass="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Appointments This Week</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Total Appts" />
                <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} name="Confirmed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Today's Appointments</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{todayAppointments.length}</span>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            {todayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                <p>No appointments for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appt) => (
                  <div key={appt._id} className="flex border border-slate-100 p-4 rounded-xl hover:shadow-sm transition">
                    <div className="mr-4 text-center">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Time</div>
                      <div className="font-bold text-blue-600 mt-1">{appt.time?.split(' - ')[0]}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{appt.userId?.name || 'Unknown Patient'}</div>
                      <div className="text-sm text-slate-500 flex items-center mt-1">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        Dr. {appt.doctorId?.name}
                      </div>
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
