import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const navigate = useNavigate();

  // SEND OTP
  const sendOtp = async () => {
    try {
      setError('');

      const res = await fetch(
        'https://mentalhealth-project-sih-mitr.onrender.com/api/auth/send-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      alert('OTP sent successfully to your email');

      setOtpSent(true);

    } catch (err) {
      setError(err.message);
    }
  };

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await register(email, password, otp);

      if (result) {
        navigate('/');
      }

    } catch (err) {
      setError(err.message || 'Registration failed');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 p-4">

      <div className="relative w-full max-w-md rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl p-8">

        {/* CLOSE BUTTON */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-600 hover:text-green-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Join Mitr
          </h2>

          <p className="mt-1 text-gray-600">
            Create your account to get started.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="student@example.com"
            />
          </div>

          {/* STEP 1 */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              Register
            </button>
          )}

          {/* STEP 2 */}
          {otpSent && (
            <>
              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3 mt-1 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Create Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 mt-1 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition-all ${
                  isLoading
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isLoading
                  ? 'Verifying OTP...'
                  : 'Verify OTP & Create Account'}
              </button>
            </>
          )}

        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}

          <Link
            to="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
};

export default SignupPage;