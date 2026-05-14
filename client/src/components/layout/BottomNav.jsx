import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Sparkles, Stethoscope, Users, ShieldCheck, Plus, Bell, Search as SearchIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const BottomNav = ({ onSearchClick }) => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-3 z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 1. Home */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </NavLink>

        {/* 2. Smart AI */}
        <NavLink 
          to="/smart-booking" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Smart AI</span>
        </NavLink>

        {/* 3. Center + (Role Action) */}
        <NavLink 
          to={user?.isAdmin ? "/admin" : "/appointments"} 
          className="flex flex-col items-center -mt-10"
        >
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border-4 border-slate-50 transform hover:scale-110 active:scale-95 transition-all">
            <Plus className="w-8 h-8" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-tighter">
            {user?.isAdmin ? "Admin" : "Booking"}
          </span>
        </NavLink>

        {/* 4. Search Overlay Trigger */}
        <button 
          onClick={onSearchClick}
          className="flex flex-col items-center gap-1 transition-all text-slate-400 active:text-blue-600"
        >
          <SearchIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Search</span>
        </button>

        {/* 5. Profile */}
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
             {user?.image ? (
               <img src={user.image} className="w-full h-full object-cover" />
             ) : (
               <span className="text-blue-600 font-bold text-[10px]">{user?.name?.charAt(0)}</span>
             )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
