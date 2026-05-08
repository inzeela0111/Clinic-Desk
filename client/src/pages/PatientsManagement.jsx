import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  Users, Search, Calendar, Phone, Mail, Clock,
  ChevronRight, ArrowLeft, Loader2, User as UserIcon,
  ShieldCheck, ExternalLink, Activity
} from 'lucide-react';
import { useGetPatientsQuery, useGetPatientDetailsQuery } from '../services/dashboardApi';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const PatientDetailsModal = ({ patientId, onClose }) => {
  const { data, isLoading } = useGetPatientDetailsQuery(patientId);
  const details = data?.data;

  if (isLoading) return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-50"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-800 font-bold text-lg">Fetching Profile...</p>
        <p className="text-slate-500 text-sm mt-2">Loading patient history and records</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F8FAFC] rounded-[2.5rem] max-w-5xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] my-auto animate-in fade-in zoom-in duration-500 border border-white/50">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <button onClick={onClose} className="flex items-center gap-2.5 text-slate-500 hover:text-blue-600 transition-all text-sm font-bold bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
            <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-black uppercase tracking-widest text-blue-900">Patient Record</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Personal Profile */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 text-white font-black text-4xl transform -rotate-3 hover:rotate-0 transition-transform">
                    {details?.profile?.name?.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 text-center">{details?.profile?.name}</h3>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-full">ID: {details?.profile?._id?.slice(-6)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Contact Details
                </h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">Email Address</p>
                      <p className="text-sm text-slate-700 font-bold break-all leading-tight">{details?.profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">Phone Number</p>
                      <p className="text-sm text-slate-700 font-bold leading-tight">{details?.profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">Member Since</p>
                      <p className="text-sm text-slate-700 font-bold leading-tight">{formatDate(details?.profile?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm h-full flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <h4 className="font-black text-slate-800 text-lg">Appointment History</h4>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
                    {details?.appointments?.length} Sessions
                  </span>
                </div>

                <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                  {details?.appointments?.map((appt) => (
                    <div key={appt._id} className="group p-5 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                          {appt.doctorId?.image ? (
                            <img src={appt.doctorId.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-xl">
                              {appt.doctorId?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-black text-slate-800 text-lg">Dr. {appt.doctorId?.name}</p>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest ${
                              appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 font-black uppercase tracking-tight mb-3">{appt.doctorId?.speciality}</p>
                          <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                              <Calendar className="w-3.5 h-3.5" /> {appt.appointmentDate}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" /> {appt.time}
                            </div>
                          </div>
                          {appt.symptoms && (
                            <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl text-sm text-slate-600 leading-relaxed border-l-4 border-blue-200 italic group-hover:bg-white group-hover:border-blue-500 transition-all">
                              "{appt.symptoms}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {details?.appointments?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                      <Calendar className="w-16 h-16 mb-4 opacity-10" />
                      <p className="font-bold text-lg">No history available</p>
                      <p className="text-sm">This patient hasn't booked any sessions yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientsManagement = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetPatientsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  const patients = data?.data || [];
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-10 p-2 sm:p-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patients <span className="text-blue-600">Central</span></h1>
          <p className="text-slate-500 text-base font-medium mt-2">Oversee all registered patients, history and engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-blue-50 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-blue-500/5 flex items-center gap-4 group hover:border-blue-100 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Database Size</p>
              <span className="text-2xl font-black text-slate-800">{patients.length} <span className="text-sm text-slate-400">Users</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-2 sm:p-10 shadow-2xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="relative group w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="w-full bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
            <button className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white text-blue-600 shadow-sm">All Records</button>
            <button className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">Recent Activity</button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-600 shadow-md">
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white rounded-tl-[1.5rem]">Patient Identity</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white hidden md:table-cell">Contact & Network</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white">Utilization</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white hidden lg:table-cell">Last Interaction</th>
                <th className="px-6 py-6 text-right rounded-tr-[1.5rem]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6"><div className="h-14 bg-slate-50 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <UserIcon className="w-10 h-10 text-slate-200" />
                      </div>
                      <p className="font-black text-slate-800 text-xl tracking-tight">No Patients Found</p>
                      <p className="text-slate-400 text-sm mt-2">Adjust your search filters to find the patient you're looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient._id} className="group hover:bg-blue-50/20 transition-all duration-300">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-lg border border-white shadow-sm group-hover:from-blue-600 group-hover:to-indigo-700 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-tight">{patient.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {patient._id?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 hidden md:table-cell">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 text-sm text-slate-600 font-bold">
                          <Mail className="w-4 h-4 text-blue-600/50" /> {patient.email}
                        </div>
                        {patient.phone && (
                          <div className="flex items-center gap-2.5 text-sm text-slate-600 font-bold">
                            <Phone className="w-4 h-4 text-emerald-600/50" /> {patient.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="bg-indigo-50 text-indigo-700 w-fit px-4 py-1.5 rounded-xl flex items-center gap-2 font-black text-[11px] uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Calendar className="w-3.5 h-3.5" />
                        {patient.appointmentCount} Bookings
                      </div>
                    </td>
                    <td className="px-6 py-6 hidden lg:table-cell">
                      {patient.lastAppointment ? (
                        <div className="group/visit">
                          <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.1em] mb-1">Dr. {patient.lastAppointment.doctor}</p>
                          <p className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {patient.lastAppointment.date}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic bg-slate-50 px-3 py-1 rounded-lg">New Patient</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => setSelectedPatientId(patient._id)}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-x-2 shadow-sm"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />

      {/* Patient Details Modal */}
      {selectedPatientId && (
        <PatientDetailsModal 
          patientId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}
    </div>
  );
};

export default PatientsManagement;
