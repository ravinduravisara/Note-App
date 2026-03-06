import API from '../utils/api';

export const loginUser = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

export const verifyOtp = async ({ email, otp }) => {
  const { data } = await API.post('/auth/verify-otp', { email, otp });
  return data;
};

export const resendOtp = async (email) => {
  const { data } = await API.post('/auth/resend-otp', { email });
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get('/users/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await API.put('/users/profile', profileData);
  return data;
};
