import { useGetDashboardStatsQuery } from '../services/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const dailyStats = data?.data?.dailyStats || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1">Detailed performance metrics of the clinic.</p>
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
