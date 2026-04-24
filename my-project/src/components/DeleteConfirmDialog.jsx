import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * Reusable delete confirmation dialog.
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   onConfirm: () => void
 *   title: string
 *   description: string
 *   confirmLabel?: string
 *   isDeleting?: boolean
 */
const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete this item?",
    description = "This action cannot be undone.",
    confirmLabel = "Delete",
    isDeleting = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                {/* Icon + Header */}
                <div className="flex items-start gap-4 mb-5">
                    <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-xl shrink-0">
                        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="size-4 text-zinc-400" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
                    </div>
                </div>

                {/* Warning box */}
                <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl p-3 mb-5">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                        ⚠️ This action is permanent and cannot be reversed.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60"
                    >
                        <Trash2 className="size-4" />
                        {isDeleting ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmDialog;
