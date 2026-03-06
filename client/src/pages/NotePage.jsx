import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';
import Editor from '../components/Editor';
import {
  fetchNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  removeCollaborator,
} from '../services/noteService';
import useAuth from '../hooks/useAuth';

const COLORS = ['#ffffff', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#f3e8ff', '#fed7d7'];

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collabEmail, setCollabEmail] = useState('');
  const [collabRole, setCollabRole] = useState('viewer');
  const [showCollab, setShowCollab] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNoteById(id);
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags?.join(', ') || '');
        setColor(data.color || '#ffffff');
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const updated = await updateNote(id, { title, content, tags: tagArray, color });
      setNote(updated);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  }, [id, title, content, tags, color]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently?')) return;
    try {
      await deleteNote(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleAddCollab = async (e) => {
    e.preventDefault();
    try {
      const updated = await addCollaborator(id, collabEmail, collabRole);
      setNote(updated);
      setCollabEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add collaborator');
    }
  };

  const handleRemoveCollab = async (userId) => {
    try {
      const updated = await removeCollaborator(id, userId);
      setNote(updated);
    } catch (err) {
      console.error('Failed to remove collaborator:', err);
    }
  };

  const isOwner = note?.owner?._id === user?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => setShowCollab(!showCollab)}
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiUserPlus size={18} />
              <span className="hidden sm:inline">Collaborators</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiSave size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Collaborators Panel */}
      {showCollab && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Collaborators</h3>
          <form onSubmit={handleAddCollab} className="flex gap-2 mb-3">
            <input
              type="email"
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <select
              value={collabRole}
              onChange={(e) => setCollabRole(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700"
            >
              Add
            </button>
          </form>
          {note?.collaborators?.length > 0 ? (
            <ul className="space-y-2">
              {note.collaborators.map((c) => (
                <li
                  key={c.user._id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium">{c.user.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({c.role})</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCollab(c.user._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiX size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No collaborators yet</p>
          )}
        </div>
      )}

      {/* Note Metadata */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full text-2xl font-bold border-none focus:outline-none mb-4 text-gray-800"
        />

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-gray-600">Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Color:</label>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                color === c ? 'border-primary-500 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Editor value={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default NotePage;
