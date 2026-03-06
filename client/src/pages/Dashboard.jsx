import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { fetchNotes, deleteNote, updateNote, createNote } from '../services/noteService';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotes = useCallback(async () => {
    try {
      const data = await fetchNotes(search);
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounce = setTimeout(() => loadNotes(), 300);
    return () => clearTimeout(debounce);
  }, [loadNotes]);

  const handleNewNote = async () => {
    try {
      const note = await createNote({ title: 'Untitled Note', content: '' });
      navigate(`/notes/${note._id}`);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleTogglePin = async (id, isPinned) => {
    try {
      const updated = await updateNote(id, { isPinned });
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? updated : n)).sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
      );
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <button
          onClick={handleNewNote}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <FiPlus /> New Note
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            {search ? 'No notes match your search' : 'No notes yet'}
          </p>
          {!search && (
            <button
              onClick={handleNewNote}
              className="text-primary-600 hover:underline font-medium"
            >
              Create your first note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
