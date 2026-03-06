import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiFileText, FiShield, FiAlertCircle } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { verifyOtp, resendOtp } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = { email, password }[field];
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (touched[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const validateAll = () => {
    const errors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return !Object.values(errors).some((e) => e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.email) {
        setVerifyEmail(err.response.data.email);
        setNeedsVerification(true);
        setMessage('Your account is not verified. Please enter the OTP sent to your email.');
        try { await resendOtp(err.response.data.email); } catch {}
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email: verifyEmail, otp });
      setNeedsVerification(false);
      setOtp('');
      setMessage('Email verified! Please sign in.');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    try {
      const data = await resendOtp(verifyEmail);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border ${
      touched[field] && fieldErrors[field]
        ? 'border-red-400 focus:ring-red-400'
        : 'border-gray-300 focus:ring-primary-500'
    } focus:outline-none focus:ring-2 focus:border-transparent`;

  const FieldError = ({ field }) =>
    touched[field] && fieldErrors[field] ? (
      <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <FiAlertCircle className="shrink-0" /> {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FiFileText className="text-3xl text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-800">Collab Notes</h1>
        </div>

        {needsVerification ? (
          <>
            <h2 className="text-xl font-semibold text-center mb-2">Verify Your Email</h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter the 6-digit code sent to <span className="font-medium text-gray-700">{verifyEmail}</span>
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>
            )}
            {message && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <div className="relative">
                  <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Didn't receive the code?{' '}
              <button onClick={handleResendOtp} className="text-primary-600 hover:underline font-medium">
                Resend OTP
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center mb-6">Welcome back</h2>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>
            )}
            {message && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                    onBlur={() => handleBlur('email')}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                  />
                </div>
                <FieldError field="email" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                    onBlur={() => handleBlur('password')}
                    className={inputClass('password')}
                    placeholder="••••••••"
                  />
                </div>
                <FieldError field="password" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
