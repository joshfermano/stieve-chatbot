import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSend,
  FiTrash2,
  FiHelpCircle,
  FiLogIn,
  FiEdit,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import LoginPrompt from './LoginPrompt';
import ClearConfirmationDialog from './ClearConfirmationDialog';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearConversation?: () => void;
}

const ChatInput = ({
  onSendMessage,
  isLoading,
  onClearConversation,
}: ChatInputProps) => {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px height
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  // Listen for suggestion clicks
  useEffect(() => {
    const handleSuggestion = (e: Event) => {
      const customEvent = e as CustomEvent;
      setMessage(customEvent.detail);
    };

    window.addEventListener('suggestion-clicked', handleSuggestion);
    return () => {
      window.removeEventListener('suggestion-clicked', handleSuggestion);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Show login prompt for first message if user is not authenticated
    if (!isAuthenticated && message.trim()) {
      setShowLoginPrompt(true);
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearClick = () => {
    setShowClearConfirmation(true);
  };

  return (
    <>
      <div
        className="p-3 sm:p-4 border-t border-[var(--border-color)]"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--background))',
        }}>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto rounded-xl py-2 px-3 flex items-center border border-[var(--border-color)]"
          style={{
            background:
              'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.05))',
            boxShadow: 'var(--card-shadow)',
          }}>
          <div className="flex-shrink-0 mr-2 text-gray-400">
            <FiEdit size={18} className="opacity-60" />
          </div>
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask STIeve something..."
            className="flex-grow resize-none bg-transparent border-none outline-none max-h-[120px] py-2 px-1 text-[var(--text-primary)] text-sm sm:text-base"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`
              p-2 rounded-md transition-all duration-200 ml-1 flex-shrink-0
              ${
                message.trim() && !isLoading
                  ? 'text-white hover:shadow-md'
                  : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
              }
            `}
            style={
              message.trim() && !isLoading
                ? {
                    background: 'var(--primary-gradient)',
                    boxShadow: 'var(--button-shadow)',
                  }
                : {}
            }
            aria-label="Send message">
            <FiSend size={18} />
          </button>
        </form>

        {/* Guest mode banner with sign in and clear options */}
        {!isAuthenticated && (
          <div
            className="flex items-center justify-between mt-2.5 max-w-4xl mx-auto px-3.5 py-2.5 text-xs rounded-lg border border-[var(--border-color)]"
            style={{
              background:
                'linear-gradient(145deg, rgba(var(--accent-secondary-rgb),0.08), rgba(var(--accent-primary-rgb),0.03))',
              backdropFilter: 'blur(8px)',
            }}>
            <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-1.5">
              <span className="font-medium">Guest Mode</span>
              <Link
                to="/auth/login"
                className="ml-2 flex items-center text-[var(--accent-primary)] hover:underline">
                <FiLogIn className="mr-1" size={14} />
                <span className="hidden sm:inline">Sign in</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
                to save conversations
              </span>
            </div>

            <button
              onClick={handleClearClick}
              className="flex items-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-[rgba(255,0,0,0.1)] px-2 py-1 rounded-md hover:shadow-sm"
              aria-label="Clear conversation">
              <FiTrash2 size={14} className="mr-1" />
              <span>Clear</span>
              <span className="hidden sm:inline ml-0.5">Conversation</span>
            </button>
          </div>
        )}

        {/* Help text for authenticated users */}
        {isAuthenticated && (
          <div
            className="flex items-center justify-center mt-2.5 max-w-4xl mx-auto px-4 py-2 rounded-lg"
            style={{
              background:
                'linear-gradient(145deg, rgba(var(--accent-primary-rgb),0.05), rgba(var(--accent-secondary-rgb),0.04))',
              backdropFilter: 'blur(8px)',
            }}>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
              <FiHelpCircle
                className="mr-1.5 text-[var(--accent-primary)]"
                size={14}
              />
              <span>
                Press <span className="font-medium mx-0.5">Enter</span> to send,{' '}
                <span className="font-medium mx-0.5">Shift+Enter</span> for new
                line
              </span>
            </div>
          </div>
        )}
      </div>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          onSendMessage(message.trim());
          setMessage('');
        }}
      />

      <ClearConfirmationDialog
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={() => {
          if (onClearConversation) {
            onClearConversation();
          }
        }}
      />
    </>
  );
};

export default ChatInput;
