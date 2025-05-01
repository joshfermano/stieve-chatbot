const Footer = () => {
  return (
    <footer className="bg-[var(--sidebar-bg)] border-t border-[var(--border-color)] py-2 text-center text-xs">
      <div className="flex flex-col items-center justify-center">
        <div>
          <span className="text-[var(--accent-primary)] font-medium">
            STI College
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            Sta. Rosa, Laguna
          </span>
        </div>
        <div className="text-gray-500 dark:text-gray-400 mt-1">
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
