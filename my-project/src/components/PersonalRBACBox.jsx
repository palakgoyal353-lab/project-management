import { useState } from "react";
import { useUser } from "@clerk/react";
import { useRBAC } from "../hooks/useRBAC";
import { ShieldCheck, ChevronDown, ChevronUp, Lock, CheckCircle2, User } from "lucide-react";

export default function PersonalRBACBox() {
  const { user } = useUser();
  const { role, isAdmin, isLeader, canCreateProject, canCreateTask, canAccessDatabaseViewer, canManageWorkspaceSettings, canViewProjects, canViewCalendar } = useRBAC();
  const [isMinimized, setIsMinimized] = useState(false);

  const displayName = user?.fullName || "Demo User";
  const userImage = user?.imageUrl || null;

  const permissionsList = [
    { name: "Create Projects", allowed: canCreateProject },
    { name: "Create Tasks", allowed: canCreateTask },
    { name: "Database Viewer", allowed: canAccessDatabaseViewer },
    { name: "Workspace Settings", allowed: canManageWorkspaceSettings },
    { name: "View Projects", allowed: canViewProjects },
    { name: "View Calendar", allowed: canViewCalendar },
  ];

  return (
    <div className="m-3 mt-4 animate-fade-up">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur shadow-sm overflow-hidden transition-all duration-300">
        
        {/* Header / Minimized Row */}
        <div 
          onClick={() => setIsMinimized(prev => !prev)}
          className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {userImage ? (
              <img 
                src={userImage} 
                alt={displayName} 
                className="size-7 rounded-full bg-zinc-200 object-cover border border-blue-500/20"
              />
            ) : (
              <div className="size-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                <User size={13} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                {displayName}
              </p>
              <span className="inline-flex items-center text-[9px] font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5">
                <ShieldCheck size={9} className="mr-0.5" />
                {role?.replace('_', ' ').toLowerCase()}
              </span>
            </div>
          </div>

          <button 
            type="button"
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            {isMinimized ? (
              <ChevronDown size={14} className="text-zinc-500" />
            ) : (
              <ChevronUp size={14} className="text-zinc-500" />
            )}
          </button>
        </div>

        {/* Permissions list (Collapsable Box) */}
        {!isMinimized && (
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 space-y-2 animate-slide-down">
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">
              Active Permissions
            </p>
            <div className="space-y-1.5">
              {permissionsList.map((perm) => (
                <div key={perm.name} className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-600 dark:text-zinc-400">{perm.name}</span>
                  {perm.allowed ? (
                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Lock size={10} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
