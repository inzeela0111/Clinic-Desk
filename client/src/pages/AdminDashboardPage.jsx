import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  UserPlus, Stethoscope, CalendarCheck, Trash2, Plus,
  CheckCircle, XCircle, Clock, ChevronDown, Loader2, Pencil, ShieldCheck
} from 'lucide-react';
import {
  useGetDoctorsQuery, useAddDoctorMutation,
  useUpdateDoctorMutation, useDeleteDoctorMutation
} from '../services/doctorsApi';
import { useGetAdminDoctorSlotsQuery, useCreateBulkSlotsMutation, useDeleteSlotMutation } from '../services/slotsApi';
import { useGetAllAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../services/appointmentsApi';

// ─── Helpers ───────────────────────────────────────────────
const SPECIALITIES = ['General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Neurologist', 'ENT'];

const Badge = ({ status }) => {
  const cfg = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
    completed: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

// ─── TAB 1: Add / Manage Doctors ───────────────────────────
const DoctorsPanel = ({ autoOpen }) => {
  const { data, isLoading } = useGetDoctorsQuery();
  const [addDoctor, { isLoading: adding }] = useAddDoctorMutation();
  const [deleteDoctor] = useDeleteDoctorMutation();
  const [updateDoctor, { isLoading: updating }] = useUpdateDoctorMutation();
  const [form, setForm] = useState({ name: '', speciality: 'General Physician', experience: '', fees: '', bio: '', image: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (autoOpen) setShowForm(true);
  }, [autoOpen]);
  const [editingId, setEditingId] = useState(null);

  const doctors = Array.isArray(data) ? data : data?.data || [];

  const handleEdit = (doc) => {
    setForm({ name: doc.name, speciality: doc.speciality, experience: doc.experience, fees: doc.fees, bio: doc.bio || '', image: doc.image || '' });
    setEditingId(doc._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ name: '', speciality: 'General Physician', experience: '', fees: '', bio: '', image: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoctor({ id: editingId, ...form, experience: Number(form.experience), fees: Number(form.fees) }).unwrap();
        toast.success('Doctor updated!');
      } else {
        await addDoctor({ ...form, experience: Number(form.experience), fees: Number(form.fees) }).unwrap();
        toast.success('Doctor added!');
      }
      handleCancel();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save doctor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await deleteDoctor(id).unwrap();
      toast.success('Doctor removed');
    } catch (err) {
      toast.error(err?.data?.message || 'Cannot delete');
    }
  };

  const handleToggleAvailability = async (doc) => {
    try {
      await updateDoctor({ id: doc._id, isAvailable: !doc.isAvailable }).unwrap();
      toast.success(`Doctor marked as ${!doc.isAvailable ? 'Available' : 'Unavailable'}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update availability');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Manage Doctors</h2>
        <button
          onClick={() => {
            if (showForm && !editingId) handleCancel();
            else { handleCancel(); setShowForm(true); }
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-700 mb-2">{editingId ? 'Edit Doctor Details' : 'New Doctor Details'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
              <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Dr. John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Speciality</label>
              <select required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.speciality} onChange={e => setForm(f => ({ ...f, speciality: e.target.value }))}>
                {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Experience (years)</label>
              <input required type="number" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="5" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Consultation Fees (₹)</label>
              <input required type="number" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="500" value={form.fees} onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-500 mb-1 block">Bio</label>
              <textarea required rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Short doctor bio..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-500 mb-1 block">Profile Image URL (Optional)</label>
              <input type="url" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://example.com/doctor-image.jpg" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={adding || updating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
              {(adding || updating) ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} {editingId ? 'Update Doctor' : 'Save Doctor'}
            </button>
            <button type="button" onClick={handleCancel}
              className="text-sm font-medium text-slate-500 hover:text-red-500 px-4 py-2 rounded-lg border border-slate-200 hover:border-red-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(doc => (
            <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
              {/* Top Gradient Strip */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="p-5 flex flex-col items-center">
                {/* Actions (Edit/Delete) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleEdit(doc)} 
                    className="p-2 bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white rounded-full shadow-sm transition-all"
                    title="Edit Doctor"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc._id)} 
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full shadow-sm transition-all"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-blue-50 shadow-md flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 overflow-hidden mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 mt-2">
                  {doc.image ? <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" /> : doc.name?.charAt(0)}
                </div>
                
                <p className="font-extrabold text-lg text-slate-800 text-center">Dr. {doc.name}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1 border border-blue-100">
                  {doc.speciality}
                </span>

                <div className="w-full grid grid-cols-2 gap-2 mt-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Experience</p>
                    <p className="text-sm font-extrabold text-slate-700">{doc.experience} Yrs</p>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Fees</p>
                    <p className="text-sm font-extrabold text-blue-600">₹{doc.fees}</p>
                  </div>
                </div>

                <div className="mt-4 w-full flex justify-center">
                  <button 
                    onClick={() => handleToggleAvailability(doc)}
                    disabled={updating}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all hover:shadow-md active:scale-95 disabled:opacity-50 ${doc.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}
                  >
                    <div className={`inline-block w-2 h-2 rounded-full mr-1.5 ${doc.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {doc.isAvailable ? 'Currently Available' : 'Not Available'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No doctors added yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TAB 2: Doctor Slots ────────────────────────────────────
const SlotsPanel = () => {
  const { data: doctorsData } = useGetDoctorsQuery();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [createBulk, { isLoading: creating }] = useCreateBulkSlotsMutation();
  const [deleteSlot] = useDeleteSlotMutation();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [interval, setInterval] = useState(30);

  const { data: slotsData, isLoading: loadingSlots } = useGetAdminDoctorSlotsQuery(
    { doctorId: selectedDoctor, date: selectedDate },
    { skip: !selectedDoctor }
  );

  const doctors = Array.isArray(doctorsData) ? doctorsData : doctorsData?.data || [];
  const slots = slotsData?.data || [];

  const generateTimeSlots = () => {
    const slots = [];
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let cur = sh * 60 + sm;
    const end = eh * 60 + em;
    while (cur + interval <= end) {
      const fmt = (m) => {
        const h = Math.floor(m / 60), min = m % 60, ampm = h < 12 ? 'AM' : 'PM';
        const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${hh}:${min.toString().padStart(2, '0')} ${ampm}`;
      };
      slots.push({ startTime: fmt(cur), endTime: fmt(cur + interval) });
      cur += interval;
    }
    return slots;
  };

  const handleCreateSlots = async () => {
    if (!selectedDoctor || !selectedDate) return toast.error('Select doctor and date');
    const generated = generateTimeSlots();
    if (!generated.length) return toast.error('No slots generated — check times');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = dayNames[new Date(selectedDate).getDay()];
    try {
      const res = await createBulk({ doctorId: selectedDoctor, date: selectedDate, day, slots: generated }).unwrap();
      toast.success(res.message || 'Slots created!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create slots');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id).unwrap();
      toast.success('Slot deleted');
    } catch (err) {
      toast.error(err?.data?.message || 'Cannot delete booked slot');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Doctor Slots</h2>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-700">Generate Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Doctor</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Start Time</label>
            <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">End Time</label>
            <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slot Duration (mins)</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={interval} onChange={e => setInterval(Number(e.target.value))}>
              {[15, 20, 30, 45, 60].map(m => <option key={m} value={m}>{m} min</option>)}
            </select>
          </div>
          <button onClick={handleCreateSlots} disabled={creating}
            className="flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Slots
          </button>
        </div>
      </div>

      {selectedDoctor && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">
            Slots {selectedDate ? `for ${selectedDate}` : '(All Dates)'}
            <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{slots.length} total</span>
          </h3>
          {loadingSlots ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No slots found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {slots.map(slot => (
                <div key={slot._id}
                  className={`relative rounded-xl border p-3 text-center text-sm transition-all ${slot.isBooked
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                  <p className="font-semibold">{slot.startTime}</p>
                  <p className="text-xs opacity-70">{slot.endTime}</p>
                  <p className="text-xs mt-1 font-medium">{slot.isBooked ? 'Booked' : 'Free'}</p>
                  {!slot.isBooked && (
                    <button onClick={() => handleDelete(slot._id)}
                      className="absolute top-1 right-1 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TAB 3: Confirm Appointments ───────────────────────────
const AppointmentsPanel = () => {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [dateFilter, setDateFilter] = useState('');
  const { data, isLoading, isFetching } = useGetAllAppointmentsQuery(
    { status: statusFilter || undefined, date: dateFilter || undefined },
    { refetchOnMountOrArgChange: true }
  );
  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const appointments = data?.data || [];

  const handleStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Appointment ${status}!`);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Appointments</h2>

      <div className="flex flex-wrap gap-3 items-center">
        {['', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
          <button key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${statusFilter === s
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}>
            {s || 'All'}
          </button>
        ))}
        <input type="date" className="ml-auto border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
      </div>

      {isLoading || isFetching ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{appt.userId?.name || 'Unknown'}</p>
                    <Badge status={appt.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Dr. {appt.doctorId?.name} — {appt.doctorId?.speciality}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.time}</span>
                    <span>{appt.appointmentDate}</span>
                    {appt.userId?.phone && <span>📞 {appt.userId.phone}</span>}
                  </div>
                  {appt.symptoms && <p className="text-xs text-slate-400 mt-1 italic">"{appt.symptoms}"</p>}
                </div>
                {appt.status !== 'cancelled' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {appt.status !== 'confirmed' && appt.status !== 'completed' && (
                      <button onClick={() => handleStatus(appt._id, 'confirmed')}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirm
                      </button>
                    )}
                    {appt.status === 'confirmed' && (
                      <button onClick={() => handleStatus(appt._id, 'completed')}
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Complete
                      </button>
                    )}
                    <button onClick={() => handleStatus(appt._id, 'cancelled')}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Dashboard ───────────────────────────────────
const TABS = [
  { id: 'doctors', label: 'Add Doctors', icon: UserPlus },
  { id: 'slots', label: 'Doctor Slots', icon: Stethoscope },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
];

const AdminDashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('doctors');
  const location = useLocation();

  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-md">
            Manage doctors, slots and appointments
          </p>
        </div>

        <div className="relative z-10 text-sm bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-4 py-2 rounded-full self-start sm:self-auto shadow-sm">
          👤 {user?.name}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'doctors' && <DoctorsPanel autoOpen={location.state?.openAddDoctor} />}
        {activeTab === 'slots' && <SlotsPanel />}
        {activeTab === 'appointments' && <AppointmentsPanel />}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
