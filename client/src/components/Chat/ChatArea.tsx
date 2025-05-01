import { useRef, useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { BsRobot, BsChatSquareQuote } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
}

interface TypingAnimationProps {
  content: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

// Enhanced markdown components with improved emphasis
const MarkdownComponents = {
  p: ({ node, ...props }: any) => <p className="mb-4 last:mb-0" {...props} />,
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-5 mb-4" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-5 mb-4" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
  strong: ({ node, ...props }: any) => (
    <strong className="font-bold text-[var(--accent-primary)]" {...props} />
  ),
  h1: ({ node, ...props }: any) => (
    <h1
      className="text-xl font-bold my-3 text-[var(--accent-primary)]"
      {...props}
    />
  ),
  h2: ({ node, ...props }: any) => (
    <h2
      className="text-lg font-bold my-2 text-[var(--accent-primary)]"
      {...props}
    />
  ),
  h3: ({ node, ...props }: any) => (
    <h3
      className="text-md font-bold my-2 text-[var(--accent-primary)]"
      {...props}
    />
  ),
  code: ({ node, inline, ...props }: { node?: any; inline?: boolean } & any) =>
    inline ? (
      <code
        className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded"
        {...props}
      />
    ) : (
      <code
        className="block bg-gray-200 dark:bg-gray-700 p-2 rounded my-2 overflow-x-auto text-sm"
        {...props}
      />
    ),
  a: ({ node, ...props }: any) => (
    <a
      className="text-[var(--accent-secondary)] font-semibold underline hover:text-[var(--accent-primary)] transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

// Function to automatically format important information in the text
const enhanceImportantInfo = (content: string): string => {
  // First, let's convert raw URLs to proper markdown links
  let enhancedContent = content
    // Convert URLs to proper markdown links
    .replace(/(?<!\[)(?<!\()(https?:\/\/[^\s]+)(?!\))/g, (match: string) => {
      // Extract the final part of the URL for a display text
      let displayText = match.replace(/^https?:\/\/(www\.)?/, '');
      // Trim long URLs for display
      if (displayText.length > 30) {
        displayText = displayText.substring(0, 30) + '...';
      }
      return `[${displayText}](${match})`;
    });

  // Special handling for m.me links
  enhancedContent = enhancedContent.replace(
    /m\.me\/([a-zA-Z0-9_.]+)/g,
    (match: string, _username: string) => `[${match}](https://${match})`
  );

  // Now apply formatting for important information
  const patterns = [
    {
      regex: /(Telephone|Mobile|Phone):\s*([\d\s\-\/\(\)]+)/g,
      replace: (_match: string, label: string, number: string) =>
        `${label}: [${number}](tel:${number.replace(/[\s\-\(\)]/g, '')})`,
    },

    {
      regex:
        /(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+([A-Z][a-zA-Z]+\s+[A-Z]\.\s+[A-Z][a-zA-Z]+)/g,
      replace: (match: string) => `**${match}**`,
    },

    {
      regex:
        /(President|Head|Dean|Director|Officer|Assistant|Coordinator)(\s+of\s+[\w\s]+)?:\s*([^,\n]+)/g,
      replace: (
        _match: string,
        role: string,
        dept: string | undefined,
        name: string
      ) => `${role}${dept || ''}: **${name}**`,
    },

    {
      regex:
        /(Office of [^,\n]+|Admissions Office|Registrar's Office|Registrar Office|Student Affairs|Finance Office)/g,
      replace: (match: string) => `**${match}**`,
    },

    // Course names and codes (BS, BA programs)
    {
      regex: /(BS|BA|MS|MA|PhD)\s+in\s+([A-Za-z\s]+)/g,
      replace: (match: string) => `**${match}**`,
    },

    // Academic forms
    {
      regex: /(Form\s+\d+|SF\d+[\-\/]?[A-Z]{2,})/g,
      replace: (match: string) => `**${match}**`,
    },

    // Address with better formatting
    {
      regex: /(Address|Location):\s*([^\.\n]+\.?)/g,
      replace: (_match: string, label: string, address: string) =>
        `${label}: **${address}**`,
    },
  ];

  // Apply all patterns
  patterns.forEach((pattern) => {
    enhancedContent = enhancedContent.replace(pattern.regex, pattern.replace);
  });

  return enhancedContent;
};

const TypingAnimation = ({
  content,
  speed = 20,
  className = '',
  onComplete,
}: TypingAnimationProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Enhance the content with auto-formatting for important information
  const enhancedContent = enhanceImportantInfo(content);

  useEffect(() => {
    if (currentIndex < enhancedContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent((prev) => prev + enhancedContent[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [enhancedContent, currentIndex, speed, isComplete, onComplete]);

  return (
    <div className={`${className} relative`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={MarkdownComponents}>
        {displayedContent}
      </ReactMarkdown>
      {currentIndex < enhancedContent.length && (
        <span className="ml-0.5 inline-block w-1 h-4 bg-[var(--accent-primary)] animate-pulse" />
      )}
    </div>
  );
};

const ChatArea = ({ messages = [], loading = false }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [animatingMessages, setAnimatingMessages] = useState<number[]>([]);
  const [completedMessages, setCompletedMessages] = useState<number[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageIndex = messages.length - 1;
      const lastMessage = messages[lastMessageIndex];

      if (
        lastMessage.role === 'model' &&
        !animatingMessages.includes(lastMessageIndex) &&
        !completedMessages.includes(lastMessageIndex)
      ) {
        setAnimatingMessages((prev) => [...prev, lastMessageIndex]);
      }
    }
  }, [messages, animatingMessages, completedMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, animatingMessages, completedMessages]);

  const handleAnimationComplete = (index: number) => {
    setAnimatingMessages((prev) => prev.filter((i) => i !== index));
    setCompletedMessages((prev) => [...prev, index]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-[var(--background)] relative">
      {/* Enhanced decorative elements */}
      <div
        className="fixed top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20 rounded-bl-full blur-xl pointer-events-none z-0 animate-pulse-slow"
        style={{ background: 'var(--secondary-gradient)' }}></div>
      <div
        className="fixed bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 opacity-20 rounded-tr-full blur-xl pointer-events-none z-0 animate-pulse-slow"
        style={{ background: 'var(--primary-gradient)' }}></div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center z-10 py-4">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300"
            style={{ background: 'var(--secondary-gradient)' }}>
            <BsRobot className="text-white w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[var(--text-primary)]">
            Hello, I'm STIeve!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-5 sm:mb-6 px-4 text-sm sm:text-base">
            Your AI assistant for STI College Sta. Rosa, Laguna. How can I help
            you today?
          </p>
          <div className="grid grid-cols-1 gap-2.5 max-w-sm sm:max-w-2xl px-2 sm:px-4">
            <SuggestionButton text="Tell me about STI College programs" />
            <SuggestionButton text="What are the admission requirements?" />
            <SuggestionButton text="When is the enrollment period?" />
            <SuggestionButton text="What facilities are available?" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5 z-10">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`
                  max-w-[90%] sm:max-w-[85%] md:max-w-[70%] p-3.5 sm:p-4 text-sm sm:text-base
                  ${
                    message.role === 'user'
                      ? 'text-white rounded-2xl rounded-tr-none shadow-md'
                      : 'text-[var(--text-primary)] rounded-2xl rounded-tl-none shadow-md border border-[var(--border-color)]'
                  }
                `}
                style={
                  message.role === 'user'
                    ? {
                        background: 'var(--primary-gradient)',
                        boxShadow: 'var(--card-shadow)',
                      }
                    : {
                        background:
                          'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.05))',
                        boxShadow: 'var(--card-shadow)',
                      }
                }>
                <div className="flex items-center mb-2">
                  {message.role === 'model' ? (
                    <>
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mr-2.5 shadow-sm"
                        style={{ background: 'var(--secondary-gradient)' }}>
                        <BsRobot className="text-[var(--accent-primary)] text-base sm:text-lg" />
                      </div>
                      <span className="font-medium">STIeve</span>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mr-2.5 shadow-sm"
                        style={{
                          background:
                            'linear-gradient(145deg, #ffffff, #f0f0f0)',
                          boxShadow: 'var(--card-shadow)',
                        }}>
                        <FiUser className="text-[var(--accent-primary)] text-base sm:text-lg" />
                      </div>
                      <span className="font-medium">You</span>
                    </>
                  )}
                </div>
                {message.role === 'model' ? (
                  <div className="markdown-content">
                    {animatingMessages.includes(index) ? (
                      <TypingAnimation
                        content={message.content}
                        speed={15}
                        onComplete={() => handleAnimationComplete(index)}
                      />
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={MarkdownComponents}>
                        {enhanceImportantInfo(message.content)}
                      </ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <div>{message.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className="flex items-center p-4 rounded-2xl rounded-tl-none w-auto shadow-md border border-[var(--border-color)]"
                style={{
                  background:
                    'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.05))',
                  boxShadow: 'var(--card-shadow)',
                }}>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-2.5"
                  style={{ background: 'var(--secondary-gradient)' }}>
                  <BsRobot className="text-[var(--accent-primary)]" />
                </div>
                <div className="flex space-x-1.5">
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                    style={{ animationDelay: '0ms' }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                    style={{ animationDelay: '150ms' }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                    style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

const SuggestionButton = ({ text }: { text: string }) => (
  <button
    className="bg-opacity-10 dark:bg-opacity-10 py-2.5 px-4 rounded-xl text-sm text-[var(--text-primary)] hover:shadow-md transition-all duration-200 text-left border border-[var(--border-color)]"
    style={{
      background:
        'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.1))',
      boxShadow: 'var(--card-shadow)',
    }}
    onClick={() => {
      const event = new CustomEvent('suggestion-clicked', { detail: text });
      window.dispatchEvent(event);
    }}>
    <div className="flex items-center">
      <BsChatSquareQuote className="mr-2 text-[var(--accent-secondary)]" />
      {text}
    </div>
  </button>
);

export default ChatArea;
