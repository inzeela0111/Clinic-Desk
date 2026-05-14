import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Brain, Sparkles, Stethoscope, Calendar, Clock,
  CheckCircle, ArrowRight, Loader2, RotateCcw, User, X,
  ShieldCheck, Activity, Lock, Zap, Star
} from 'lucide-react';
import { useGetSuggestedSpecialityMutation } from '../services/aiApi';
import { useGetDoctorsQuery } from '../services/doctorsApi';
import { useGetDoctorSlotsQuery } from '../services/slotsApi';
import { useBookAppointmentMutation } from '../services/appointmentsApi';

// ─── Step indicator ─────────────────────────────────────────
const Step = ({ num, title, desc, active, done }) => (
  <div className={`flex items-start gap-3 flex-1 pb-4 border-b-2 transition-all ${
    active ? 'border-blue-600' : done ? 'border-slate-200' : 'border-slate-100'
  }`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
      active ? 'bg-blue-600 text-white' : done ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'
    }`}>
      {done ? <CheckCircle className="w-4 h-4" /> : num}
    </div>
    <div className="hidden sm:block">
      <p className={`text-sm font-bold ${active || done ? 'text-slate-800' : 'text-slate-400'}`}>{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────
const AISymptomsPage = () => {
  const [step, setStep] = useState(1);
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

  const COMMON_SYMPTOMS = [
    { emoji: '🤕', text: 'Headache & dizziness' },
    { emoji: '🫁', text: 'Chest pain & breathlessness' },
    { emoji: '🦠', text: 'Skin rash & itching' },
    { emoji: '🦴', text: 'Joint pain & swelling' },
    { emoji: '👂', text: 'Ear pain & hearing loss' },
    { emoji: '🤒', text: 'Fever & cough' },
    { emoji: '🤢', text: 'Nausea & vomiting' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Symptom Checker & <span className="text-blue-600">Smart Booking</span>
          </h1>
          <p className="text-slate-500 text-base max-w-md">
            Describe your symptoms and our AI will suggest the right doctor for you.
          </p>
        </div>
        <div className="hidden md:block w-72 h-48 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl relative overflow-hidden flex-shrink-0 border border-blue-100">
          {/* Abstract illustration placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-40 bg-white rounded-xl shadow-sm border border-blue-100 flex flex-col items-center justify-center gap-3">
               <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                 <span className="text-blue-600 font-bold text-xl">+</span>
               </div>
               <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
               <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
               <div className="mt-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">AI</div>
            </div>
            <Activity className="absolute right-8 top-10 w-8 h-8 text-red-400 opacity-50" />
            <div className="absolute left-6 bottom-12 w-4 h-4 rounded-full bg-indigo-300 opacity-50"></div>
            <div className="absolute right-12 bottom-8 w-6 h-6 rounded-full bg-blue-300 opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Step Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl px-8 py-6 shadow-sm flex gap-4 overflow-x-auto custom-scrollbar">
        <Step num="1" title="Symptoms" desc="Describe your health issue" active={step === 1} done={step > 1} />
        <Step num="2" title="Pick Doctor" desc="AI suggests best match" active={step === 2} done={step > 2} />
        <Step num="3" title="Book Slot" desc="Choose date & time" active={step === 3} done={step > 3} />
        <Step num="4" title="Confirmed" desc="You're all set!" active={step === 4} done={false} />
      </div>

      {/* ── STEP 1: Symptoms ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Describe Your Symptoms</h2>
                  <p className="text-sm text-slate-500">Be as specific as possible for best results</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" /> Your data is secure
              </div>
            </div>

            {/* Textarea */}
            <div className="relative mb-8 ">
              <textarea
                rows={4}
                value={symptoms}
                maxLength={500}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Example: I have been experiencing severe headaches for the past 3 days, with some dizziness and blurry vision when I stand up..."
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
              />
              <div className="absolute bottom-3 right-4 text-[10px] font-medium text-slate-400">
                {symptoms.length}/500
              </div>
            </div>

            {/* Quick Symptoms */}
            <div className="mb-8">
              <p className="text-xs font-bold text-slate-800 mb-3">Or choose common symptoms</p>
              <div className="flex flex-wrap gap-2.5">
                {COMMON_SYMPTOMS.map((item, idx) => (
                  <button key={idx} onClick={() => setSymptoms(s => s ? `${s}, ${item.text}` : item.text)}
                    className="flex items-center gap-2 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-full transition-colors">
                    <span className="text-base">{item.emoji}</span> {item.text}
                  </button>
                ))}
                <button className="flex items-center gap-1 text-xs font-medium border border-dashed border-slate-300 bg-slate-50 text-slate-500 px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors">
                  + More symptoms
                </button>
              </div>
            </div>

            {/* Analyze Button */}
            <button onClick={handleAnalyze} disabled={aiLoading || symptoms.trim().length < 10}
              className="w-full flex items-center justify-between bg-gradient-to-r from-blue-700 to-violet-700 hover:from-blue-800 hover:to-violet-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-60 shadow-lg shadow-blue-500/20 group">
              <div className="flex items-center gap-2 mx-auto">
                {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>{aiLoading ? 'Analyzing...' : 'Analyze Symptoms with AI'}</span>
              </div>
              {!aiLoading && <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute right-8" />}
            </button>
          </div>

          {/* Bottom Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Brain className="w-5 h-5" /></div>
              <div><p className="text-xs font-bold text-slate-800">AI-Powered Analysis</p><p className="text-[10px] text-slate-500 leading-tight mt-0.5">Advanced AI analyzes your symptoms instantly</p></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Lock className="w-5 h-5" /></div>
              <div><p className="text-xs font-bold text-slate-800">Secure & Private</p><p className="text-[10px] text-slate-500 leading-tight mt-0.5">Your health data is 100% encrypted & secure</p></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Zap className="w-5 h-5" /></div>
              <div><p className="text-xs font-bold text-slate-800">Quick & Easy</p><p className="text-[10px] text-slate-500 leading-tight mt-0.5">Get doctor suggestions in just a few seconds</p></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Star className="w-5 h-5" /></div>
              <div><p className="text-xs font-bold text-slate-800">Smart Matching</p><p className="text-[10px] text-slate-500 leading-tight mt-0.5">AI matches you with the most relevant specialists</p></div>
            </div>
          </div>
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
