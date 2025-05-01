import { Link } from 'react-router-dom';
import { FiX, FiLogIn, FiUserPlus, FiSave } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { useState, useEffect } from 'react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPrompt = ({ isOpen, onClose }: LoginPromptProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
        isOpen
          ? 'bg-black bg-opacity-50 opacity-100'
          : 'bg-opacity-0 opacity-0 pointer-events-none'
      }`}>
      <div
        className={`bg-[var(--card-bg)] rounded-2xl p-7 max-w-md w-full mx-4 relative shadow-xl border border-[var(--border-color)] transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 bg-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg border-4 border-[var(--card-bg)]">
            <BsRobot className="text-[var(--accent-primary)] w-12 h-12" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
          <FiX size={18} />
        </button>

        <div className="text-center mt-8 mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Get More from STIeve
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to save conversations and access them anywhere
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <Link
            to="/auth/login"
            className="w-full flex justify-center items-center px-4 py-3.5 rounded-xl shadow-sm text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors">
            <FiLogIn className="mr-2" /> Sign In
          </Link>
          <Link
            to="/auth/register"
            className="w-full flex justify-center items-center px-4 py-3.5 rounded-xl shadow-sm text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] bg-transparent hover:bg-[var(--sidebar-bg)] transition-colors">
            <FiUserPlus className="mr-2" /> Create Account
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[var(--card-bg)] text-xs text-gray-500">
              or
            </span>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium">
            <FiSave className="mr-1.5" /> Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
