import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiPlus } from 'react-icons/fi';

const Sidebar = ({ onNewNote }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary-50 text-primary-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full p-4 flex flex-col">
      <button
        onClick={onNewNote}
        className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6"
      >
        <FiPlus />
        New Note
      </button>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/" end className={linkClass}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <FiUser /> Profile
        </NavLink>
      </nav>

      <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
        Collab Notes &copy; 2026
      </div>
    </aside>
  );
};

export default Sidebar;
