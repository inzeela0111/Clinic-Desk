import { useGetDoctorsQuery } from '../services/doctorsApi';
import { useSelector } from 'react-redux';
import { Plus, Mail, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorsQuery({});
  const doctors = data?.data || [];
  // For standard user payload structure when wrapping not applied by backend
  // The first prompt I saw indicated Dr API returned `doctors` without `success:` wrapper in `doctorController.js` but let's cater to both
  const doctorList = Array.isArray(data) ? data : (data?.data || []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctors</h1>
          <p className="text-slate-500 mt-1">{user?.isAdmin ? "Manage hospital doctors and availability." : "Our hospital doctors and availability."}</p>
        </div>
        {user?.isAdmin && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 transition font-medium">
            <Plus className="w-5 h-5" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-white border border-slate-200 rounded-xl animate-pulse"></div>)}
        </div>
      ) : doctorList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctorList.map((dr) => (
            <div key={dr._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
              <div className="h-24 bg-blue-50 w-full"></div>
              <div className="px-6 flex flex-col items-center -mt-10">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-sm overflow-hidden flex items-center justify-center bg-slate-100 object-cover">
                   {dr.image ? <img src={dr.image} alt={dr.name} className="w-full h-full object-cover" /> : <div className="text-2xl font-bold text-blue-600">{dr.name.charAt(0)}</div>}
                </div>
                <h3 className="mt-3 font-bold text-lg text-slate-800 text-center">{dr.name}</h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1">
                  {dr.speciality}
                </span>
              </div>
              <div className="p-6 pt-4 space-y-3">

                <div className="flex justify-between border-t border-slate-100 pt-3 mt-3">
                  <div className="text-center w-1/2 border-r border-slate-100">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fee</div>
                    <div className="font-bold text-slate-700 mt-1">₹{dr.fees}</div>
                  </div>
                  <div className="text-center w-1/2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Exp</div>
                    <div className="font-bold text-slate-700 mt-1">{dr.experience} Yrs</div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button 
                  onClick={() => navigate(`/doctors/${dr._id}`)}
                  className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium py-2 rounded-lg transition flex justify-center items-center"
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
