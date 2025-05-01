import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
  FiLogIn,
  FiUser,
} from 'react-icons/fi';
import stiLogo from '../assets/sti_logo.png';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { user, logout, isAuthenticated, refreshAuth } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setDarkMode(systemDark);
      document.documentElement.classList.toggle('dark', systemDark);
      localStorage.setItem('theme', systemDark ? 'dark' : 'light');
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[var(--sidebar-bg)] shadow-sm border-b border-[var(--border-color)]">
      <div className="px-3 sm:px-4 py-2.5 mx-auto flex items-center justify-between">
        {/* Left side - Logo and menu toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 sm:p-2 rounded-lg bg-transparent hover:bg-[var(--sidebar-bg)] dark:hover:bg-[var(--card-bg)] text-[var(--text-primary)] transition-colors"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[var(--accent-secondary)] p-1">
              <img
                src={stiLogo}
                alt="STI Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/vite.svg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-[var(--accent-primary)] leading-none">
                STIeve
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight">
                Sta. Rosa, Laguna
              </span>
            </div>
          </Link>
        </div>

        {/* Right side - Theme toggle and auth buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg bg-transparent hover:bg-[var(--sidebar-bg)] dark:hover:bg-[var(--card-bg)] text-[var(--text-primary)] transition-colors"
            aria-label={
              darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }>
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {isAuthenticated ? (
            // Authenticated user menu
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 rounded-lg">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-xs text-[var(--text-primary)]">
                  {user?.username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex sm:hidden items-center justify-center p-1.5 rounded-lg text-[var(--text-primary)] hover:bg-[var(--sidebar-bg)] dark:hover:bg-[var(--card-bg)] transition-colors"
                aria-label="Log out">
                <FiLogOut size={20} />
              </button>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors text-xs font-medium">
                <FiLogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            // Guest auth options
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                <FiLogIn className="mr-1.5" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                to="/auth/register"
                className="hidden sm:flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors">
                <FiUser className="mr-1.5" /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
