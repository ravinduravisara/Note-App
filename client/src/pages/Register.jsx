import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiFileText, FiPhone, FiShield, FiAlertCircle } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { verifyOtp, resendOtp } from '../services/authService';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+?[0-9]{9,15}$/.test(value.replace(/\s/g, ''))) return 'Enter a valid phone number (9-15 digits)';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = { name, email, phone, password, confirmPassword }[field];
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
      name: validateField('name', name),
      email: validateField('email', email),
      phone: validateField('phone', phone),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };
    setFieldErrors(errors);
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    return !Object.values(errors).some((e) => e);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      const data = await register({ name, email, phone, password });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      navigate('/login');
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
      const data = await resendOtp(email);
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

        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold text-center mb-6">Create an account</h2>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleFieldChange('name', e.target.value, setName)}
                    onBlur={() => handleBlur('name')}
                    className={inputClass('name')}
                    placeholder="Your name"
                  />
                </div>
                <FieldError field="name" />
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value, setPhone)}
                    onBlur={() => handleBlur('phone')}
                    className={inputClass('phone')}
                    placeholder="+94771234567"
                  />
                </div>
                <FieldError field="phone" />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={inputClass('confirmPassword')}
                    placeholder="••••••••"
                  />
                </div>
                <FieldError field="confirmPassword" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center mb-2">Verify Your Email</h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {message}
              </div>
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
              <button
                onClick={handleResendOtp}
                className="text-primary-600 hover:underline font-medium"
              >
                Resend OTP
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
