import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiUserPlus,
} from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setFormError("Passwords don't match");
      return false;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(username, email, password);

      // Important: Wait a moment before redirecting to allow state to update
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--card-bg)] shadow-lg rounded-2xl p-8 border border-[var(--border-color)]">
        <div className="mb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[var(--accent-secondary)] rounded-lg flex items-center justify-center">
            <BsRobot className="text-[var(--accent-primary)] w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Create an Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join STIeve and get personalized assistance
          </p>
        </div>

        {(error || formError) && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error || formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <FiUser />
              </div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <FiMail />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  <FiLock />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 text-[var(--accent-primary)] border-gray-300 rounded focus:ring-[var(--accent-secondary)]"
            />
            <label
              htmlFor="show-password"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Show password
            </label>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-base font-medium bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" /> Create Account
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--accent-primary)] dark:hover:text-[var(--accent-secondary)]">
          <FiArrowLeft className="mr-2" /> Back to Chat
        </Link>
      </div>
    </div>
  );
};

export default Register;
