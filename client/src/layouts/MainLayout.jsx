import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createNote } from '../services/noteService';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleNewNote = async () => {
    try {
      const note = await createNote({ title: 'Untitled Note', content: '' });
      navigate(`/notes/${note._id}`);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="hidden md:block">
            <Sidebar onNewNote={handleNewNote} />
          </div>
        )}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
