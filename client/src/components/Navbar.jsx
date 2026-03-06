import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiFileText } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
        <FiFileText className="text-2xl" />
        Collab Notes
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FiUser />
          <span className="hidden sm:inline">{user?.name}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
