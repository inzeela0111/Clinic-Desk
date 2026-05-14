import { useGetDashboardStatsQuery } from '../services/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

const ReportsPage = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const dailyStats = data?.data?.dailyStats || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart2 className="w-7 h-7 text-white" />
            </div>
            Reports & Analytics
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-md">
            Detailed performance metrics of the clinic.
          </p>
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Appointments Over Time</h2>
          
          {isLoading ? (
             <div className="h-80 bg-slate-50 animate-pulse rounded-xl"></div>
          ) : (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="All Appointments" />
                  <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} name="Confirmed" />
                  <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
       </div>
    </div>
  );
};

export default ReportsPage;
