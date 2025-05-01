import { FiX, FiTrash2 } from 'react-icons/fi';

interface ClearConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: ClearConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full mx-4 relative shadow-lg border border-[var(--border-color)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
          <FiX size={18} />
        </button>

        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <FiTrash2 size={24} className="text-red-600 dark:text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Clear conversation?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            This will delete all messages in your current conversation. This
            action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] bg-transparent hover:bg-[var(--sidebar-bg)] transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
            Clear Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearConfirmationDialog;
