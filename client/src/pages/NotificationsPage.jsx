import { useSelector } from 'react-redux';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from '../services/appointmentsApi';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useSelector(state => state.auth);

  const { data: adminData, isLoading: adminLoading } = useGetAllAppointmentsQuery(undefined, { skip: !user?.isAdmin });
  const { data: myData, isLoading: myLoading } = useGetMyAppointmentsQuery(undefined, { skip: user?.isAdmin });
  
  const allAppointments = user?.isAdmin ? (adminData?.data || []) : (myData?.data || []);
  const isLoading = user?.isAdmin ? adminLoading : myLoading;

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

  const past = allAppointments.filter(a =>
    a.appointmentDate !== todayStr && 
    a.appointmentDate !== tomorrowStr
  );

  const statusStyle = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bell className="w-7 h-7 text-white" />
            </div>
            Notifications
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-md">
            Your upcoming and past appointments
          </p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <h2 className="font-semibold text-slate-700">Upcoming</h2>
          <span className="ml-auto text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
            {upcoming.length}
          </span>
        </div>

        {upcoming.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            No upcoming appointments
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcoming.map(appt => (
              <div key={appt._id} className="px-6 py-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {appt.doctorId?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Dr. {appt.doctorId?.name}
                      </p>
                      <p className="text-xs text-slate-500">{appt.doctorId?.speciality}</p>
                      <p className="text-xs text-blue-500 font-medium mt-1">
                        📅 {appt.appointmentDate} · ⏰ {appt.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[appt.status]}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
          <h2 className="font-semibold text-slate-700">Past</h2>
          <span className="ml-auto text-xs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
            {past.length}
          </span>
        </div>

        {past.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            No past appointments
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {past.map(appt => (
              <div key={appt._id} className="px-6 py-4 hover:bg-slate-50 transition opacity-70">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {appt.doctorId?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Dr. {appt.doctorId?.name}
                      </p>
                      <p className="text-xs text-slate-400">{appt.doctorId?.speciality}</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        📅 {appt.appointmentDate} · ⏰ {appt.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[appt.status]}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;