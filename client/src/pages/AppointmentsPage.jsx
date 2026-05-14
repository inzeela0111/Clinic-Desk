import { useState } from 'react';
import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery, useCancelAppointmentMutation } from '../services/appointmentsApi';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CalendarCheck, Search } from 'lucide-react';

const AppointmentsPage = () => {
  const { user } = useSelector(state => state.auth);
  
  const [dateFilter, setDateFilter] = useState('');

  const { data: adminData, isLoading: adminLoading } = useGetAllAppointmentsQuery(undefined, { skip: !user?.isAdmin });
  const { data: myData, isLoading: myLoading } = useGetMyAppointmentsQuery(undefined, { skip: user?.isAdmin });
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const rawAppointments = user?.isAdmin ? (adminData?.data || []) : (myData?.data || []);
  const isLoading = user?.isAdmin ? adminLoading : myLoading;

  let filteredAppointments = [...rawAppointments];
  if (dateFilter) {
    filteredAppointments = filteredAppointments.filter(appt => appt.appointmentDate === dateFilter);
  }

  const appointments = filteredAppointments.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a._id < b._id ? 1 : -1;
  });

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <CalendarCheck className="w-7 h-7 text-white" />
            </div>
            Appointments
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-md">
            Manage clinic bookings and schedule.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-blue-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Search className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-700">Filter by Date</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] focus:shadow-[0_4px_25px_-8px_rgba(59,130,246,0.25)]"
          />
          {dateFilter && (
            <button 
              onClick={() => setDateFilter('')}
              className="text-sm px-4 py-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-bold transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">DateTime</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No appointments found.</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {format(new Date(appt.appointmentDate), 'MMM d, yyyy')}<br/>
                      <span className="text-blue-600 text-sm">{appt.time}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">
                       {appt.userId?.name || user?.name || 'Self'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      Dr. {appt.doctorId?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appt.status}
                      </span>
                      {!user?.isAdmin && appt.status !== 'cancelled' && appt.status !== 'confirmed' && (
                        <div className="flex gap-2 items-center mt-1">
                          <button 
                            onClick={() => handleCancel(appt._id)}
                            disabled={isCancelling}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export default AppointmentsPage;
