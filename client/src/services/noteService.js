import API from '../utils/api';

export const fetchNotes = async (search = '') => {
  const { data } = await API.get('/notes', { params: { search } });
  return data;
};

export const fetchNoteById = async (id) => {
  const { data } = await API.get(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData) => {
  const { data } = await API.post('/notes', noteData);
  return data;
};

export const updateNote = async (id, noteData) => {
  const { data } = await API.put(`/notes/${id}`, noteData);
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await API.delete(`/notes/${id}`);
  return data;
};

export const addCollaborator = async (noteId, email, role) => {
  const { data } = await API.post(`/notes/${noteId}/collaborators`, { email, role });
  return data;
};

export const removeCollaborator = async (noteId, userId) => {
  const { data } = await API.delete(`/notes/${noteId}/collaborators/${userId}`);
  return data;
};
