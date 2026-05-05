import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetDoctorQuery } from '../services/doctorsApi';
import {
  ArrowLeft, Star, Clock, DollarSign, CheckCircle,
  Stethoscope, Calendar, Shield, Users, MapPin,
  IndianRupee
} from 'lucide-react';

const specialityColors = {
  'Cardiologist':      { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100' },
  'Neurologist':       { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100' },
  'Dermatologist':     { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-100' },
  'Orthopedic':        { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100' },
  'General Physician': { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-100' },
  'ENT':               { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-100' },
};

const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDoctorQuery(id);

  // Handle both { data: doctor } and direct doctor object
  const doctor = data?.data || data;

  const clr = specialityColors[doctor?.speciality] || {
    bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100'
  };

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ─── Error / Not found ─── */
  if (isError || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <Stethoscope className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Doctor not found</h2>
        <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">C</div>
            <span className="text-xl font-extrabold text-blue-600 tracking-tight">ClinicDesk</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/doctors-public" className="hover:text-blue-600 transition">Find Doctors</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md shadow-blue-100 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── BACK BUTTON ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* ── PROFILE CARD ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Avatar card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-5 bg-gray-100 flex items-center justify-center">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-extrabold text-blue-600">{doctor.name?.charAt(0)}</span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{doctor.name}</h1>

            <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${clr.bg} ${clr.text} ${clr.border} mb-4`}>
              {doctor.speciality}
            </span>

            {/* Availability badge */}
            <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl ${doctor.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${doctor.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
              {doctor.isAvailable ? 'Available Now' : 'Not Available'}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 grid grid-cols-2 gap-4">
            {[
              { icon: Clock,       label: 'Experience', value: `${doctor.experience} Yrs` },
              { icon: IndianRupee,  label: 'Fees',       value: `₹${doctor.fees}` },
              { icon: Star,        label: 'Rating',     value: '4.8 ★' },
              { icon: Users,       label: 'Patients',   value: '500+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Icon className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-base font-extrabold text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Book CTA */}
          <Link
            to="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-2xl font-extrabold text-lg shadow-lg shadow-blue-200 transition"
          >
            <Calendar className="inline w-5 h-5 mr-2 -mt-0.5" />
            Book Appointment
          </Link>

          <p className="text-center text-xs text-gray-400">Login required to complete booking</p>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* About */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" /> About
            </h2>
            <p className="text-gray-500 leading-relaxed text-base">
              {doctor.bio || 'No bio available.'}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" /> Why Choose {doctor.name?.split(' ')[0]}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                `${doctor.experience}+ years of clinical expertise`,
                `Specialist in ${doctor.speciality}`,
                'Accepts online & in-clinic bookings',
                'Verified & credentialed physician',
                'Compassionate patient-first approach',
                'Real-time slot availability',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Info */}
          <div className={`rounded-3xl border p-8 ${clr.bg} ${clr.border}`}>
            <h2 className={`text-xl font-extrabold mb-6 flex items-center gap-2 ${clr.text}`}>
              <Calendar className="w-5 h-5" /> Consultation Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Mode',        value: 'In-Clinic & Online' },
                { label: 'Fee',         value: `₹${doctor.fees} per visit` },
                { label: 'Wait Time',   value: '~15 minutes' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-white">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        <div className="bg-blue-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200">
          <div className="text-white">
            <h3 className="text-2xl font-extrabold mb-2">Ready to book with {doctor.name?.split(' ')[0]}?</h3>
            <p className="text-blue-100 text-sm">Instant confirmation · Secure payments · Easy rescheduling</p>
          </div>
          <Link
            to="/login"
            className="shrink-0 bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-8 py-4 rounded-2xl transition shadow-lg text-sm"
          >
            Book Now →
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="font-bold text-gray-800 text-base">Contact Us</span>
            <span>📍 Address: ClinicDesk Medical Center, New Delhi</span>
            <span>📞 Phone: +91 98765 43210</span>
            <span>📧 Email: support@clinicdesk.com</span>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-green-600 font-medium hover:text-green-700 transition">
              💬 WhatsApp
            </a>
          </div>
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} ClinicDesk · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoctorProfilePage;
