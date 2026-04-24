import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, X, Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, addWorkspaceAsync } from "../feature/WorkspaceSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function WorkspaceDropdown() {
    const { workspaces } = useSelector((state) => state.workspace);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSelectWorkspace = (organizationId) => {
        dispatch(setCurrentWorkspace(organizationId));
        setIsOpen(false);
        navigate('/');
    };

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        setIsSubmitting(true);
        try {
            await dispatch(addWorkspaceAsync({
                name: newWorkspaceName.trim(),
                description: "New workspace"
            })).unwrap();
            toast.success(`Workspace "${newWorkspaceName}" created!`);
            setNewWorkspaceName("");
            setIsCreating(false);
            setIsOpen(false);
            navigate('/');
        } catch (error) {
            toast.error("Failed to create workspace.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isCreating && inputRef.current) inputRef.current.focus();
    }, [isCreating]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsCreating(false);
                setNewWorkspaceName("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative m-3" ref={dropdownRef}>
            <button
                onClick={() => { setIsOpen(prev => !prev); setIsCreating(false); }}
                className="w-full flex items-center justify-between p-2.5 h-auto text-left rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 className="size-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">
                            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg top-full left-0 mt-1 overflow-hidden">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1 px-2 py-1">
                            Workspaces
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                            {workspaces?.map((ws) => (
                                <div
                                    key={ws.id}
                                    onClick={() => onSelectWorkspace(ws.id)}
                                    className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                                        <span className="text-white text-xs font-bold">{ws.name[0].toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{ws.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{ws.members?.length || 0} members</p>
                                    </div>
                                    {currentWorkspace?.id === ws.id && (
                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                    )}
                                </div>
                            ))}
                            {workspaces.length === 0 && (
                                <p className="text-sm text-center text-zinc-400 py-4">No workspaces yet</p>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-zinc-800" />

                    <div className="p-2">
                        {isCreating ? (
                            <form onSubmit={handleCreateWorkspace} className="flex items-center gap-2 p-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="Workspace name..."
                                    className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newWorkspaceName.trim()}
                                    className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                                >
                                    <Check className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsCreating(false); setNewWorkspaceName(""); }}
                                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X className="size-3.5 text-zinc-500" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center text-sm gap-2 w-full px-2 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Create Workspace
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;
