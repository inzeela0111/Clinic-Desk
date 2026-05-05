import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="font-medium text-slate-800 text-lg">
        {/* Dynamic page title can be added here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-slate-600">
          <div className="bg-slate-100 p-2 rounded-full">
            <User className="w-5 h-5" />
          </div>
          <span className="font-medium">{user?.name || "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
