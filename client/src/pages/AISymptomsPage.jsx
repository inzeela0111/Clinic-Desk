import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Brain, Sparkles, Stethoscope, Calendar, Clock,
  CheckCircle, ArrowRight, Loader2, RotateCcw, User, X
} from 'lucide-react';
import { useGetSuggestedSpecialityMutation } from '../services/aiApi';
import { useGetDoctorsQuery } from '../services/doctorsApi';
import { useGetDoctorSlotsQuery } from '../services/slotsApi';
import { useBookAppointmentMutation } from '../services/appointmentsApi';

// ─── Step indicator ─────────────────────────────────────────
const Step = ({ num, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
      done ? 'bg-emerald-500 text-white' :
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
      'bg-slate-100 text-slate-400'
    }`}>
      {done ? <CheckCircle className="w-4 h-4" /> : num}
    </div>
    <span className={`text-sm font-medium hidden sm:block ${active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const StepDivider = ({ done }) => (
  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
);

// ─── Main Component ─────────────────────────────────────────
const AISymptomsPage = () => {
  const [step, setStep] = useState(1); // 1=symptoms, 2=pick doctor, 3=pick slot, 4=done
  const [symptoms, setSymptoms] = useState('');
  const [suggestedSpeciality, setSuggestedSpeciality] = useState('');
  const [aiReason, setAiReason] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedAppt, setBookedAppt] = useState(null);

  const [getSuggestion, { isLoading: aiLoading }] = useGetSuggestedSpecialityMutation();
  const [bookAppointment, { isLoading: booking }] = useBookAppointmentMutation();

  const { data: doctorsData } = useGetDoctorsQuery(
    { speciality: suggestedSpeciality },
    { skip: !suggestedSpeciality }
  );

  const { data: slotsData, isLoading: loadingSlots } = useGetDoctorSlotsQuery(
    { doctorId: selectedDoctor?._id, date: selectedDate },
    { skip: !selectedDoctor?._id || !selectedDate }
  );

  const matchedDoctors = (Array.isArray(doctorsData) ? doctorsData : doctorsData?.data || []).filter(
    d => d.speciality === suggestedSpeciality && d.isActive && d.isAvailable
  );

  const availableSlots = (slotsData?.data || []).filter(s => !s.isBooked);

  // ── Step 1: AI Analysis ──────────────────────────────────
  const handleAnalyze = async () => {
    if (!symptoms.trim() || symptoms.trim().length < 10)
      return toast.error('Please describe your symptoms in more detail');
    try {
      const res = await getSuggestion(symptoms).unwrap();
      const raw = res.speciality?.trim() || '';
      const VALID = ['General Physician','Cardiologist','Dermatologist','Orthopedic','Neurologist','ENT'];
      const matched = VALID.find(s => raw.toLowerCase().includes(s.toLowerCase())) || 'General Physician';
      setSuggestedSpeciality(matched);
      setAiReason(raw);
      setStep(2);
    } catch (err) {
      toast.error(err?.data?.message || 'AI service error. Please try again.');
    }
  };

  // ── Step 3: Book ─────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a slot');
    try {
      const res = await bookAppointment({
        doctorId: selectedDoctor._id,
        slotId: selectedSlot._id,
        symptoms,
      }).unwrap();
      setBookedAppt(res.data);
      setStep(4);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Booking failed');
    }
  };

  const reset = () => {
    setStep(1); setSymptoms(''); setSuggestedSpeciality('');
    setAiReason(''); setSelectedDoctor(null); setSelectedDate('');
    setSelectedSlot(null); setBookedAppt(null); setViewingDoctor(null);
  };

  const SPECIALITY_ICONS = {
    'General Physician': '🩺', 'Cardiologist': '❤️', 'Dermatologist': '🧴',
    'Orthopedic': '🦴', 'Neurologist': '🧠', 'ENT': '👂',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Symptom Checker & Smart Booking</h1>
        <p className="text-slate-500 text-sm mt-1">Describe your symptoms — our AI will suggest the right doctor</p>
      </div>

      {/* Step Bar */}
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
        <Step num="1" label="Symptoms" active={step === 1} done={step > 1} />
        <StepDivider done={step > 1} />
        <Step num="2" label="Pick Doctor" active={step === 2} done={step > 2} />
        <StepDivider done={step > 2} />
        <Step num="3" label="Book Slot" active={step === 3} done={step > 3} />
        <StepDivider done={step > 3} />
        <Step num="4" label="Confirmed" active={step === 4} done={false} />
      </div>

      {/* ── STEP 1: Symptoms ── */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Describe Your Symptoms</h2>
              <p className="text-xs text-slate-500">Be as specific as possible for best results</p>
            </div>
          </div>
          <textarea
            rows={5}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="Example: I have been experiencing severe headaches for the past 3 days, with some dizziness and blurry vision when I stand up..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all"
          />
          <div className="flex flex-wrap gap-2">
            {['Headache & dizziness','Chest pain & shortness of breath','Skin rash & itching','Joint pain & swelling','Ear pain & hearing loss','Fever & cough'].map(ex => (
              <button key={ex} onClick={() => setSymptoms(ex)}
                className="text-xs border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-full transition-all">
                {ex}
              </button>
            ))}
          </div>
          <button onClick={handleAnalyze} disabled={aiLoading || symptoms.trim().length < 10}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-200">
            {aiLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Analyze Symptoms</>
            )}
          </button>
        </div>
      )}

      {/* ── STEP 2: Pick Doctor ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* AI Result */}
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="text-4xl">{SPECIALITY_ICONS[suggestedSpeciality] || '🩺'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">AI Recommendation</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">{suggestedSpeciality}</h2>
              <p className="text-sm text-slate-500 mt-1">Based on your symptoms, a <span className="font-semibold text-blue-600">{suggestedSpeciality}</span> specialist is recommended.</p>
            </div>
          </div>

          <h3 className="font-semibold text-slate-700">
            Available {suggestedSpeciality} Doctors
            <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{matchedDoctors.length} found</span>
          </h3>

          {matchedDoctors.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400">
              <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p>No doctors available for this speciality</p>
              <button onClick={reset} className="mt-3 text-sm text-blue-600 hover:underline">Try again</button>
            </div>
          ) : (
            <div className="grid gap-3">
              {matchedDoctors.map(doc => (
                <div key={doc._id} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 transition-all group flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => { setSelectedDoctor(doc); setStep(3); }}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                      {doc.image ? <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" /> : doc.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Dr. {doc.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{doc.speciality}</p>
                      <div className="flex gap-4 mt-1 text-xs text-slate-500">
                        <span>{doc.experience} yrs experience</span>
                        <span className="font-semibold text-slate-700">₹{doc.fees}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewingDoctor(doc)} className="px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors whitespace-nowrap">
                      View Profile
                    </button>
                    <button onClick={() => { setSelectedDoctor(doc); setStep(3); }} className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={reset} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Start over
          </button>
        </div>
      )}

      {/* ── STEP 3: Pick Slot ── */}
      {step === 3 && selectedDoctor && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
              {selectedDoctor.image ? <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" /> : selectedDoctor.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800">Dr. {selectedDoctor.name}</p>
              <p className="text-xs text-slate-500">{selectedDoctor.speciality} · ₹{selectedDoctor.fees} per visit</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Select Date</label>
              <input type="date" min={new Date().toISOString().split('T')[0]}
                value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {selectedDate && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">
                    Available Slots
                    {!loadingSlots && <span className="ml-2 text-blue-600">{availableSlots.length} available</span>}
                  </label>
                  {loadingSlots ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4 text-center">No slots available for this date</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <button key={slot._id} onClick={() => setSelectedSlot(slot)}
                          className={`border rounded-xl p-2.5 text-center text-xs transition-all ${
                            selectedSlot?._id === slot._id
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}>
                          <p className="font-semibold">{slot.startTime}</p>
                          <p className="opacity-70 mt-0.5">{slot.endTime}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSlot && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                    <p className="font-semibold text-slate-700 mb-2">Booking Summary</p>
                    <div className="flex items-center gap-2 text-slate-600"><User className="w-4 h-4 text-blue-500" /> Dr. {selectedDoctor.name}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-blue-500" /> {selectedDate}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4 text-blue-500" /> {selectedSlot.startTime} – {selectedSlot.endTime}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Stethoscope className="w-4 h-4 text-blue-500" /> ₹{selectedDoctor.fees} consultation</div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStep(2); setSelectedSlot(null); setSelectedDate(''); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-4 py-2 rounded-xl transition-colors">
              ← Back
            </button>
            <button onClick={handleBook} disabled={booking || !selectedSlot}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-200">
              {booking ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</> : <><CheckCircle className="w-5 h-5" /> Confirm Booking</>}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirmed ── */}
      {step === 4 && bookedAppt && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Appointment Booked!</h2>
          <p className="text-slate-500 text-sm">Your appointment has been confirmed. See you soon!</p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 text-sm max-w-xs mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor</span>
              <span className="font-semibold text-slate-800">Dr. {selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Speciality</span>
              <span className="font-semibold text-slate-800">{selectedDoctor?.speciality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold text-slate-800">{bookedAppt.appointmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time</span>
              <span className="font-semibold text-slate-800">{bookedAppt.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Pending</span>
            </div>
          </div>

          <button onClick={reset}
            className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 hover:border-blue-400 px-5 py-2 rounded-xl transition-all">
            <RotateCcw className="w-4 h-4" /> Book Another
          </button>
        </div>
      )}

      {/* Doctor Profile Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button onClick={() => setViewingDoctor(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl mx-auto overflow-hidden shadow-lg shadow-blue-200 mb-4">
                {viewingDoctor.image ? <img src={viewingDoctor.image} alt={viewingDoctor.name} className="w-full h-full object-cover" /> : viewingDoctor.name?.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800">Dr. {viewingDoctor.name}</h2>
              <p className="text-blue-600 font-semibold text-center mb-6">{viewingDoctor.speciality}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-lg font-bold text-slate-800">{viewingDoctor.experience} Yrs</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fee</p>
                  <p className="text-lg font-bold text-slate-800">₹{viewingDoctor.fees}</p>
                </div>
                <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">About</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{viewingDoctor.bio || 'A highly experienced specialist committed to providing the best patient care and ensuring a healthy future.'}</p>
                </div>
              </div>

              <button onClick={() => { setSelectedDoctor(viewingDoctor); setStep(3); setViewingDoctor(null); }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200">
                <Calendar className="w-5 h-5" /> Book with this Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISymptomsPage;
