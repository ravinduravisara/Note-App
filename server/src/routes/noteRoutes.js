const express = require('express');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addNoteCollaborator,
  removeNoteCollaborator,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router
  .route('/:id')
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);
router.post('/:id/collaborators', protect, addNoteCollaborator);
router.delete('/:id/collaborators/:userId', protect, removeNoteCollaborator);

module.exports = router;
