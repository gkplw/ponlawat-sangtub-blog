import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Reset", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#efeeeb] rounded-lg p-6 w-full max-w-md mx-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex-1">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex space-x-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-24 px-6 py-4 bg-white rounded-full border text-center font-medium hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-24 px-6 py-4 bg-[#26231e] text-white rounded-full text-center font-medium hover:bg-gray-700 transition-colors"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
