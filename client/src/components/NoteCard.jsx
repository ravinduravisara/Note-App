import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiBookmark, FiClock, FiUsers } from 'react-icons/fi';

const NoteCard = ({ note, onDelete, onTogglePin }) => {
  const navigate = useNavigate();

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const preview = stripHtml(note.content).slice(0, 120);
  const date = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow group relative"
      style={{ borderTopColor: note.color, borderTopWidth: '3px' }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 text-lg truncate flex-1 pr-2">
          {note.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note._id, !note.isPinned);
            }}
            className={`p-1.5 rounded-lg hover:bg-gray-100 ${
              note.isPinned ? 'text-primary-600' : 'text-gray-400'
            }`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <FiBookmark size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {preview && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-3">{preview}</p>
      )}

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <FiClock size={12} /> {date}
        </span>
        {note.collaborators?.length > 0 && (
          <span className="flex items-center gap-1">
            <FiUsers size={12} /> {note.collaborators.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
