import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetDoctorsQuery } from '../services/doctorsApi';
import { Menu, X, Search, Star, Clock, ArrowRight, Stethoscope } from 'lucide-react';

const SPECIALITIES = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Neurologist', 'ENT'];

const specialityColors = {
  'Cardiologist':      'text-red-600 bg-red-50 border-red-100',
  'Neurologist':       'text-purple-600 bg-purple-50 border-purple-100',
  'Dermatologist':     'text-pink-600 bg-pink-50 border-pink-100',
  'Orthopedic':        'text-orange-600 bg-orange-50 border-orange-100',
  'General Physician': 'text-green-600 bg-green-50 border-green-100',
  'ENT':               'text-teal-600 bg-teal-50 border-teal-100',
};

const PublicDoctorsPage = () => {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeSpec, setActiveSpec]     = useState('All');
  const [search, setSearch]             = useState('');

  const { data, isLoading } = useGetDoctorsQuery({});
  const allDoctors = Array.isArray(data) ? data : (data?.data || []);

  const filtered = allDoctors.filter(dr => {
    const matchSpec   = activeSpec === 'All' || dr.speciality === activeSpec;
    const matchSearch = dr.name.toLowerCase().includes(search.toLowerCase()) ||
                        dr.speciality.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-200">C</div>
            <span className="text-xl font-extrabold text-blue-600 tracking-tight">ClinicDesk</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/doctors-public" className="text-blue-600 font-semibold">Find Doctors</Link>
            <a href="/#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
            <a href="/#about" className="hover:text-blue-600 transition">About</a>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md shadow-blue-100 transition">
              Get Started
            </Link>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
            <Link to="/" className="text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/doctors-public" className="text-blue-600 font-semibold" onClick={() => setMobileOpen(false)}>Find Doctors</Link>
            <hr className="border-gray-100" />
            <Link to="/login" className="text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* ── HERO BANNER — lighter blue ── */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-500 py-14 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Find Your Specialist</h1>
          <p className="text-blue-50 text-lg mb-8">Browse our verified doctors and book an appointment in seconds.</p>

          {/* Search bar — white background */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or speciality…"
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-sm text-gray-700 bg-white outline-none shadow-xl focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-wrap gap-3">
          {SPECIALITIES.map(sp => (
            <button
              key={sp}
              onClick={() => setActiveSpec(sp)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                activeSpec === sp
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* ── DOCTOR GRID ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20">

        <p className="text-sm text-gray-400 mb-6">
          {isLoading ? 'Loading…' : `${filtered.length} doctor${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-3" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2 mx-auto mb-6" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No doctors found</h3>
            <p className="text-gray-400 text-sm max-w-xs">Try a different speciality or clear your search.</p>
            <button
              onClick={() => { setActiveSpec('All'); setSearch(''); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dr => {
              const clr = specialityColors[dr.speciality] || 'text-blue-600 bg-blue-50 border-blue-100';
              return (
                <div
                  key={dr._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
                >
                  {/* Top colour strip */}
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-5">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center mb-4">
                        {dr.image ? (
                          <img src={dr.image} alt={dr.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-extrabold text-blue-600">{dr.name?.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-900 text-center">{dr.name}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-2 ${clr}`}>
                        {dr.speciality}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex justify-around border-y border-gray-50 py-4 mb-5">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium">Experience</p>
                        <p className="text-sm font-extrabold text-gray-800 mt-0.5">{dr.experience} Yrs</p>
                      </div>
                      <div className="w-px bg-gray-100" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium">Fees</p>
                        <p className="text-sm font-extrabold text-gray-800 mt-0.5">₹{dr.fees}</p>
                      </div>
                      <div className="w-px bg-gray-100" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium">Rating</p>
                        <p className="text-sm font-extrabold text-gray-800 mt-0.5">4.8 ★</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {dr.bio && (
                      <p className="text-xs text-gray-400 text-center leading-relaxed mb-5 line-clamp-2">
                        "{dr.bio}"
                      </p>
                    )}

                    {/* Availability */}
                    <div className={`flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl mb-5 ${dr.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${dr.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                      {dr.isAvailable ? 'Available Now' : 'Not Available'}
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/doctor/${dr._id}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-blue-100 text-sm"
                    >
                      View Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="font-bold text-gray-800 text-base">Contact Us</span>
            <span>📍 Address: ClinicDesk Medical Center, Indore</span>
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

export default PublicDoctorsPage;
