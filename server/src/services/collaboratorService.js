const Note = require('../models/Note');
const User = require('../models/User');

const addCollaborator = async (noteId, ownerUserId, email, role = 'viewer') => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new Error('Note not found');
  }

  if (note.owner.toString() !== ownerUserId.toString()) {
    throw new Error('Only the owner can add collaborators');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found with that email');
  }

  if (user._id.toString() === ownerUserId.toString()) {
    throw new Error('You cannot add yourself as a collaborator');
  }

  const existing = note.collaborators.find(
    (c) => c.user.toString() === user._id.toString()
  );
  if (existing) {
    existing.role = role;
  } else {
    note.collaborators.push({ user: user._id, role });
  }

  await note.save();
  return note;
};

const removeCollaborator = async (noteId, ownerUserId, collaboratorUserId) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new Error('Note not found');
  }

  if (note.owner.toString() !== ownerUserId.toString()) {
    throw new Error('Only the owner can remove collaborators');
  }

  note.collaborators = note.collaborators.filter(
    (c) => c.user.toString() !== collaboratorUserId.toString()
  );

  await note.save();
  return note;
};

module.exports = { addCollaborator, removeCollaborator };
