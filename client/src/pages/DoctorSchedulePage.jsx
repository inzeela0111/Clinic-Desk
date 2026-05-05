import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDoctorQuery } from '../services/doctorsApi';
import { useGetDoctorSlotsQuery } from '../services/slotsApi';
import { useBookAppointmentMutation } from '../services/appointmentsApi';
import { ArrowLeft, Clock, IndianRupee, Calendar, Info, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: doctorData, isLoading: doctorLoading } = useGetDoctorQuery(id);
  const doctor = doctorData?.data || doctorData;

  const [activeTab, setActiveTab] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symptoms, setSymptoms] = useState('');

  const { data: slotsData, isLoading: slotsLoading } = useGetDoctorSlotsQuery(
    { doctorId: id, date: selectedDate },
    { skip: !selectedDate }
  );
  // Based on other endpoints, data might be nested or direct array
  const slots = Array.isArray(slotsData) ? slotsData : (slotsData?.data || []);

  const [bookAppointment, { isLoading: isBooking }] = useBookAppointmentMutation();

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get local date string YYYY-MM-DD without timezone shift issues
    const getLocalDateString = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (activeTab === 'today') {
      setSelectedDate(getLocalDateString(today));
    } else if (activeTab === 'tomorrow') {
      setSelectedDate(getLocalDateString(tomorrow));
    } else if (activeTab === 'custom') {
      if (customDate) {
        setSelectedDate(customDate);
      } else {
        setSelectedDate(getLocalDateString(today));
      }
    }
  }, [activeTab, customDate]);

  const handleBookClick = () => {
    if (!selectedSlot) return;
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    try {
      await bookAppointment({
        doctorId: id,
        slotId: selectedSlot._id,
        symptoms
      }).unwrap();
      
      toast.success('Appointment booked successfully!');
      setIsModalOpen(false);
      navigate('/appointments');
    } catch (err) {
      toast.error(err?.data?.message || 'Slot already booked');
    }
  };

  if (doctorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Doctor not found.</p>
        <button onClick={() => navigate('/doctors')} className="mt-4 text-blue-600 hover:underline">
          Go back to doctors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/doctors')}
        className="flex items-center text-gray-500 hover:text-blue-600 transition font-medium group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Doctors
      </button>

      {/* Doctor Profile Top Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0 bg-gray-50 flex items-center justify-center">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-blue-600">{doctor.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {doctor.speciality}
                </span>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 self-start ${doctor.isAvailable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <div className={`w-2 h-2 rounded-full ${doctor.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {doctor.isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Exp</span>
                <span className="font-bold text-gray-800 mt-0.5">{doctor.experience} Years</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5"/> Fees</span>
                <span className="font-bold text-gray-800 mt-0.5">₹{doctor.fees}</span>
              </div>

            </div>
            
            {doctor.bio && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Slots Bottom Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> Available Slots
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => { setActiveTab('today'); setSelectedSlot(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'today' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Today
          </button>
          <button 
            onClick={() => { setActiveTab('tomorrow'); setSelectedSlot(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'tomorrow' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Tomorrow
          </button>
          <button 
            onClick={() => { setActiveTab('custom'); setSelectedSlot(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'custom' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Custom Date
          </button>
          
          {activeTab === 'custom' && (
            <input 
              type="date" 
              value={customDate || ''}
              min={new Date().toLocaleDateString('en-CA')}
              onChange={(e) => { setCustomDate(e.target.value); setSelectedSlot(null); }}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white"
            />
          )}
        </div>

        {/* Slots Grid */}
        {slotsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium">
            No slots available for this date.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {slots.map(slot => {
              const isSelected = selectedSlot?._id === slot._id;
              if (slot.isBooked) {
                return (
                  <div key={slot._id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center opacity-60 cursor-not-allowed">
                    <span className="block text-sm font-medium text-gray-400 line-through">{slot.startTime} - {slot.endTime}</span>
                    <span className="text-xs text-gray-500 font-semibold mt-0.5 block uppercase tracking-wider">Booked</span>
                  </div>
                );
              }
              return (
                <button
                  key={slot._id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl border-2 text-center transition focus:outline-none ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-100' 
                      : 'border-green-300 hover:border-green-500 hover:bg-green-50 text-green-700 bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold">{slot.startTime} - {slot.endTime}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Book Button */}
        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            onClick={handleBookClick}
            disabled={!selectedSlot}
            className={`px-8 py-3 rounded-xl font-bold transition flex items-center justify-center min-w-[200px] ${
              selectedSlot 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transform hover:-translate-y-0.5' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedSlot ? 'Book This Slot' : 'Select a slot'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-bold text-slate-800">Confirm Booking</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5 bg-slate-50/50">
              <div className="bg-blue-50 rounded-xl p-4 text-blue-900 text-sm leading-relaxed border border-blue-100">
                <span className="font-semibold text-blue-800 block mb-1">Appointment Details:</span>
                Confirm booking with Dr. <strong className="font-bold">{doctor.name}</strong> on <strong className="font-bold">{selectedDate}</strong> at <strong className="font-bold">{selectedSlot?.startTime} - {selectedSlot?.endTime}</strong>?
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Symptoms <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="E.g., fever for 2 days, headache..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none h-24 bg-white shadow-sm placeholder:text-slate-400"
                ></textarea>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 flex gap-3 bg-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmBooking}
                disabled={isBooking}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedulePage;
