import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery, useCancelAppointmentMutation } from '../services/appointmentsApi';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const { user } = useSelector(state => state.auth);
  
  const { data: adminData, isLoading: adminLoading } = useGetAllAppointmentsQuery(undefined, { skip: !user?.isAdmin });
  const { data: myData, isLoading: myLoading } = useGetMyAppointmentsQuery(undefined, { skip: user?.isAdmin });
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const appointments = user?.isAdmin ? (adminData?.data || []) : (myData?.data || []);
  const isLoading = user?.isAdmin ? adminLoading : myLoading;

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
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage clinic bookings and schedule.</p>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6 overflow-x-auto">
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
