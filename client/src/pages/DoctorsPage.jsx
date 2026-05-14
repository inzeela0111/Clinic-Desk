import { useState } from 'react';
import { useGetDoctorsQuery } from '../services/doctorsApi';
import { useSelector } from 'react-redux';
import { Plus, Calendar, Search, Stethoscope, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SPECIALITIES = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Neurologist', 'ENT'];

const DoctorsPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorsQuery({});
  const doctorList = Array.isArray(data) ? data : (data?.data || []);

  const [search, setSearch] = useState('');
  const [activeSpec, setActiveSpec] = useState('All');

  const filtered = doctorList.filter(dr => {
    const matchSpec = activeSpec === 'All' || dr.speciality === activeSpec;
    const matchSearch = dr.name.toLowerCase().includes(search.toLowerCase()) ||
                        dr.speciality.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Gradient Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            Doctors Directory
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-md">
            {user?.isAdmin 
              ? "Manage hospital doctors, update their availability, and add new specialists." 
              : "Find and book appointments with our expert hospital doctors and specialists."}
          </p>
        </div>

        {user?.isAdmin && (
          <button 
            onClick={() => navigate('/admin', { state: { openAddDoctor: true } })} 
            className="relative z-10 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-blue-200 shadow-sm p-3 sm:p-4 space-y-4 relative overflow-hidden">
        {/* Subtle background glow for search section */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors by name or speciality..."
            className="w-full pl-11 pr-5 py-3 rounded-full text-sm text-slate-700 bg-white border-2 border-transparent outline-none focus:border-blue-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] focus:shadow-[0_4px_25px_-8px_rgba(59,130,246,0.25)] ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 placeholder-slate-400"
          />
        </div>

        {/* Specialty Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center flex-wrap">
          <div className="flex flex-wrap justify-center gap-2">
            {SPECIALITIES.map(sp => (
              <button
                key={sp}
                onClick={() => setActiveSpec(sp)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeSpec === sp
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105 border-transparent'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
            {isLoading ? 'Searching...' : `${filtered.length} Specialist${filtered.length !== 1 ? 's' : ''} Found`}
          </span>
        </div>
      </div>

      {/* Doctor Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-24 bg-slate-100"></div>
              <div className="p-6 flex flex-col items-center -mt-8">
                <div className="w-16 h-16 rounded-full bg-slate-200 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded-full w-24 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No doctors found</h3>
          <p className="text-slate-400 text-sm mb-4">Try a different filter or clear your search.</p>
          <button
            onClick={() => { setActiveSpec('All'); setSearch(''); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((dr) => (
            <div key={dr._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              
              {/* Blue Top Strip */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="p-6 flex flex-col items-center">
                {/* Large Avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg mb-4 group-hover:border-blue-300 transition-all duration-300">
                  {dr.image 
                    ? <img src={dr.image} alt={dr.name} className="w-full h-full object-cover" /> 
                    : <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-4xl font-extrabold text-blue-600">{dr.name.charAt(0)}</div>
                  }
                </div>

                {/* Name & Specialty */}
                <h3 className="font-extrabold text-xl text-slate-800 text-center">{dr.name}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mt-2 border border-blue-100">
                  {dr.speciality}
                </span>

                {/* Availability */}
                <div className={`flex items-center gap-1.5 mt-3 text-xs font-semibold ${
                  dr.isAvailable !== false ? 'text-green-600' : 'text-red-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${dr.isAvailable !== false ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></div>
                  {dr.isAvailable !== false ? 'Available Now' : 'Not Available'}
                </div>
              </div>

              {/* Stats */}
              <div className="mx-5 mb-4 rounded-xl bg-slate-50 border border-slate-100 flex divide-x divide-slate-100">
                <div className="flex-1 text-center py-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fee</p>
                  <p className="text-base font-extrabold text-blue-600 mt-0.5">₹{dr.fees}</p>
                </div>
                <div className="flex-1 text-center py-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">{dr.experience} Yrs</p>
                </div>
                <div className="flex-1 text-center py-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                  <p className="text-base font-extrabold text-amber-500 mt-0.5">4.8 ★</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-5 pb-5">
                <button 
                  onClick={() => navigate(`/doctors/${dr._id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-200 flex justify-center items-center text-sm shadow-lg shadow-blue-500/20"
                >
                  <Calendar className="w-4 h-4 mr-2" /> View Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
