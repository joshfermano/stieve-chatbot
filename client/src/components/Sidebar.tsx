import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiTrash2,
  FiMessageSquare,
  FiLogIn,
  FiHash,
  FiUser,
  FiZap,
} from 'react-icons/fi';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isAuthenticated: boolean;
}

const Sidebar = ({
  isOpen,
  conversations = [],
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isAuthenticated,
}: SidebarProps) => {
  return (
    <aside
      className={`
        fixed top-[61px] left-0 z-40 h-[calc(100vh-61px)] 
        bg-[var(--sidebar-gradient)] backdrop-blur-sm
        transition-all duration-300 ease-in-out border-r border-[var(--border-color)]
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
        flex flex-col overflow-hidden
      `}
      style={{
        backgroundImage: 'var(--sidebar-gradient)',
      }}>
      {isOpen && (
        <>
          <div className="p-3.5">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              style={{
                backgroundImage: 'var(--primary-gradient)',
                boxShadow: 'var(--button-shadow)',
              }}>
              <FiPlus size={16} /> New Conversation
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto px-3 pt-1">
            {isAuthenticated ? (
              <>
                {conversations.length > 0 && (
                  <div className="mb-2 px-2 text-xs font-medium tracking-wide flex items-center gap-1.5">
                    <FiZap
                      size={11}
                      className="text-yellow-500 dark:text-[var(--accent-secondary)]"
                    />
                    <span className="text-yellow-500 dark:text-[var(--accent-secondary)]">
                      CONVERSATIONS
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`
                          flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer group
                          ${
                            activeConversation === conversation.id
                              ? 'text-white'
                              : 'text-[var(--text-primary)] hover:bg-[var(--card-bg)] hover:shadow-sm'
                          }
                          transition-all duration-200
                        `}
                        style={
                          activeConversation === conversation.id
                            ? { backgroundImage: 'var(--primary-gradient)' }
                            : {}
                        }
                        onClick={() => onSelectConversation(conversation.id)}>
                        <div className="flex items-center overflow-hidden gap-2 max-w-[85%]">
                          <div
                            className={`flex-shrink-0 ${
                              activeConversation === conversation.id
                                ? 'text-white'
                                : 'text-[var(--accent-primary)]'
                            }`}>
                            {activeConversation === conversation.id ? (
                              <FiMessageSquare size={15} />
                            ) : (
                              <FiHash size={15} />
                            )}
                          </div>
                          <span className="truncate text-sm">
                            {conversation.title}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className={`
                            p-1 rounded-md 
                            ${
                              activeConversation === conversation.id
                                ? 'opacity-60 hover:opacity-100 hover:bg-[rgba(255,255,255,0.15)]'
                                : 'opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-[rgba(var(--accent-secondary-rgb),0.2)] hover:text-[var(--text-primary)]'
                            }
                            transition-all duration-150
                          `}
                          aria-label="Delete conversation">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center p-5 mt-6 text-center rounded-lg border border-[var(--border-color)] shadow-md"
                      style={{
                        background:
                          'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.05))',
                        boxShadow: 'var(--card-shadow)',
                      }}>
                      <div
                        className="w-12 h-12 rounded-full bg-[rgba(var(--accent-primary-rgb),0.1)] flex items-center justify-center mb-3"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.1), rgba(var(--accent-primary-rgb),0.15))',
                        }}>
                        <FiMessageSquare
                          size={20}
                          className="text-[var(--accent-primary)]"
                        />
                      </div>
                      <p className="text-[var(--text-primary)] mb-1 text-sm font-medium">
                        No conversations yet
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-snug">
                        Start a new one to chat with STIeve
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div
                  className="p-5 rounded-lg text-center space-y-3 w-full border border-[var(--border-color)] shadow-md"
                  style={{
                    background:
                      'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.05))',
                    boxShadow: 'var(--card-shadow)',
                  }}>
                  <div
                    className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(var(--accent-secondary-rgb),0.3), rgba(var(--accent-primary-rgb),0.1))',
                    }}>
                    <FiUser
                      size={22}
                      className="text-[var(--accent-primary)]"
                    />
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm">
                    Sign in to STIeve
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    Save your conversations and access them anytime
                  </p>
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    style={{
                      backgroundImage: 'var(--primary-gradient)',
                      boxShadow: 'var(--button-shadow)',
                    }}>
                    <FiLogIn className="mr-1.5" size={14} /> Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="p-3 mt-auto border-t border-[var(--border-color)]"
            style={{
              background:
                'linear-gradient(0deg, rgba(var(--accent-secondary-rgb),0.05), transparent)',
            }}>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">STI College</span>
              <span className="text-[8px] text-gray-400">•</span>
              <span>Sta. Rosa, Laguna</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
