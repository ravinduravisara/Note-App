const Note = require('../models/Note');
const { buildSearchQuery } = require('../utils/searchHelper');
const { addCollaborator, removeCollaborator } = require('../services/collaboratorService');

// GET /api/notes
const getNotes = async (req, res) => {
  try {
    const filter = buildSearchQuery(req.query.search, req.user._id);
    const notes = await Note.find(filter)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email')
      .sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const isOwner = note.owner._id.toString() === req.user._id.toString();
    const isCollaborator = note.collaborators.some(
      (c) => c.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      color: color || '#ffffff',
      owner: req.user._id,
    });

    const populated = await note.populate('owner', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();
    const isEditor = note.collaborators.some(
      (c) =>
        c.user.toString() === req.user._id.toString() && c.role === 'editor'
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({ message: 'Not authorized to edit this note' });
    }

    const { title, content, tags, color, isPinned, isArchived } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;

    const updated = await note.save();
    const populated = await updated.populate([
      { path: 'owner', select: 'name email' },
      { path: 'collaborators.user', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/notes/:id/collaborators
const addNoteCollaborator = async (req, res) => {
  try {
    const { email, role } = req.body;
    const note = await addCollaborator(req.params.id, req.user._id, email, role);
    const populated = await note.populate([
      { path: 'owner', select: 'name email' },
      { path: 'collaborators.user', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/notes/:id/collaborators/:userId
const removeNoteCollaborator = async (req, res) => {
  try {
    const note = await removeCollaborator(
      req.params.id,
      req.user._id,
      req.params.userId
    );
    const populated = await note.populate([
      { path: 'owner', select: 'name email' },
      { path: 'collaborators.user', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addNoteCollaborator,
  removeNoteCollaborator,
};
