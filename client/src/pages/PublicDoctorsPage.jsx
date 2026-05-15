import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetDoctorsQuery } from '../services/doctorsApi';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Search, Star, Clock, ArrowRight, Stethoscope, Moon, Sun, Globe } from 'lucide-react';

const SPECIALITIES = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Neurologist', 'ENT'];

const specialityColors = {
  'Cardiologist':      'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800',
  'Neurologist':       'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
  'Dermatologist':     'text-pink-600 bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800',
  'Orthopedic':        'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800',
  'General Physician': 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
  'ENT':               'text-teal-600 bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800',
};

const PublicDoctorsPage = () => {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeSpec, setActiveSpec]     = useState('All');
  const [search, setSearch]             = useState('');

  const { isDark, toggleTheme } = useTheme();
  const { t, lang, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(lang === 'en' ? 'hi' : 'en');

  const { data, isLoading } = useGetDoctorsQuery({});
  const allDoctors = Array.isArray(data) ? data : (data?.data || []);

  const filtered = allDoctors.filter(dr => {
    const matchSpec   = activeSpec === 'All' || dr.speciality === activeSpec;
    const matchSearch = dr.name.toLowerCase().includes(search.toLowerCase()) ||
                        dr.speciality.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-200 dark:shadow-none">C</div>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">ClinicDesk</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{t('home') || 'Home'}</Link>
            <Link to="/doctors-public" className="text-blue-600 dark:text-blue-400 font-semibold">{t('findDoctor') || 'Find Doctors'}</Link>
            <a href="/#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{t('howItWorks') || 'How it Works'}</a>
            <a href="/#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{t('about') || 'About'}</a>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-slate-700 pr-4">
              <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 transition text-xs font-bold" aria-label="Toggle Language">
                <Globe className="w-4 h-4" /> {lang === 'en' ? 'EN' : 'हिंदी'}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 transition" aria-label="Toggle Theme">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">{t('login') || 'Login'}</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md shadow-blue-100 dark:shadow-none transition">
              {t('getStarted') || 'Get Started'}
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 text-gray-600 dark:text-slate-400 text-xs font-bold" aria-label="Toggle Language">
              <Globe className="w-4 h-4" /> {lang === 'en' ? 'EN' : 'हिंदी'}
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-slate-400" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-gray-600 dark:text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-6 py-5 flex flex-col gap-4 shadow-lg">
            <Link to="/" className="text-gray-600 dark:text-slate-400 font-medium" onClick={() => setMobileOpen(false)}>{t('home') || 'Home'}</Link>
            <Link to="/doctors-public" className="text-blue-600 dark:text-blue-400 font-semibold" onClick={() => setMobileOpen(false)}>{t('findDoctor') || 'Find Doctors'}</Link>
            <hr className="border-gray-100 dark:border-slate-800" />
            <Link to="/login" className="text-gray-600 dark:text-slate-400 font-medium" onClick={() => setMobileOpen(false)}>{t('login') || 'Login'}</Link>
            <Link to="/register" className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold" onClick={() => setMobileOpen(false)}>{t('getStarted') || 'Get Started'}</Link>
          </div>
        )}
      </nav>

      {/* ── HERO BANNER — lighter blue ── */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-900 dark:to-indigo-900 py-14 px-6 md:px-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('findDoctor') || 'Find Your Specialist'}</h1>
          <p className="text-blue-50 dark:text-blue-200 text-lg mb-8">{t('findDoctorSubtext') || 'Browse our verified doctors and book an appointment in seconds.'}</p>

          {/* Search bar — white background */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchDoctors') || "Search by name or speciality…"}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-sm text-gray-700 dark:text-white bg-white dark:bg-slate-800 outline-none shadow-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-300"
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
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {sp === 'All' ? (t('allSpecialities') || 'All') : (t(sp.toLowerCase().replace(' ', '')) || sp)}
            </button>
          ))}
        </div>
      </div>

      {/* ── DOCTOR GRID ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20">

        <p className="text-sm text-gray-400 dark:text-slate-500 mb-6">
          {isLoading ? (t('loading') || 'Loading…') : `${filtered.length} ${filtered.length !== 1 ? (t('doctorsFound') || 'doctors found') : (t('doctorFound') || 'doctor found')}`}
        </p>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4 mx-auto mb-3" />
                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full w-1/2 mx-auto mb-6" />
                <div className="h-10 bg-gray-100 dark:bg-slate-700 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-blue-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-white">{t('noDoctorsFound')}</h3>
            <p className="text-gray-400 dark:text-slate-400 text-sm max-w-xs">{t('tryDifferentSpeciality')}</p>
            <button
              onClick={() => { setActiveSpec('All'); setSearch(''); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}

        {/* Cards */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dr => {
              const clr = specialityColors[dr.speciality] || 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800';
              return (
                <div
                  key={dr._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
                >
                  {/* Top colour strip */}
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-5">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                        {dr.image ? (
                          <img src={dr.image} alt={dr.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{dr.name?.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white text-center">{dr.name}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-2 ${clr}`}>
                        {t(dr.speciality?.toLowerCase().replace(' ', '')) || dr.speciality}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex justify-around border-y border-gray-50 dark:border-slate-700 py-4 mb-5">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">{t('experience') || 'Experience'}</p>
                        <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">{dr.experience} Yrs</p>
                      </div>
                      <div className="w-px bg-gray-100 dark:bg-slate-700" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">{t('fees') || 'Fees'}</p>
                        <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">₹{dr.fees}</p>
                      </div>
                      <div className="w-px bg-gray-100 dark:bg-slate-700" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">{t('rating') || 'Rating'}</p>
                        <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">4.8 ★</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {dr.bio && (
                      <p className="text-xs text-gray-400 dark:text-slate-400 text-center leading-relaxed mb-5 line-clamp-2">
                        "{dr.bio}"
                      </p>
                    )}

                    {/* Availability */}
                    <div className={`flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl mb-5 ${dr.isAvailable ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${dr.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                      {dr.isAvailable ? t('available') || 'Available Now' : t('notAvailable') || 'Not Available'}
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/doctor/${dr._id}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-blue-100 dark:shadow-none text-sm"
                    >
                      {t('viewProfile') || 'View Profile'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-10 px-6 mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="font-bold text-gray-800 dark:text-white text-base">{t('contactUs')}</span>
            <span>📍 Address: ClinicDesk Medical Center, Indore</span>
            <span>📞 Phone: +91 98765 43210</span>
            <span>📧 Email: support@clinicdesk.com</span>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-green-600 dark:text-green-500 font-medium hover:text-green-700 dark:hover:text-green-400 transition">
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
