import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkspaces } from '../feature/WorkspaceSlice';
import {
  DatabaseIcon, RefreshCwIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon,
  UsersIcon, FolderOpenIcon, CheckSquareIcon, MessageSquareIcon,
  LayersIcon, UserCheckIcon, AlertCircleIcon, DownloadIcon, Trash2Icon, XIcon, ShieldAlertIcon,
  FolderPlusIcon, RotateCcwIcon, CpuIcon, ShieldCheckIcon, Lock
} from 'lucide-react';
import { useRBAC } from '../hooks/useRBAC';

const BASE_URL = 'http://localhost:3000';

const TABLE_META = {
  users:            { label: 'Users',            icon: UsersIcon,        color: 'blue'   },
  workspaces:       { label: 'Workspaces',        icon: LayersIcon,       color: 'purple' },
  workspaceMembers: { label: 'Workspace Members', icon: UserCheckIcon,    color: 'indigo' },
  projects:         { label: 'Projects',          icon: FolderOpenIcon,   color: 'emerald'},
  projectMembers:   { label: 'Project Members',   icon: UsersIcon,        color: 'teal'   },
  tasks:            { label: 'Tasks',             icon: CheckSquareIcon,  color: 'amber'  },
  comments:         { label: 'Comments',          icon: MessageSquareIcon,color: 'rose'   },
};

const BADGE = {
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  indigo:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  teal:    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  amber:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  rose:    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const RING = {
  blue:'border-blue-500', purple:'border-purple-500', indigo:'border-indigo-500',
  emerald:'border-emerald-500', teal:'border-teal-500', amber:'border-amber-500', rose:'border-rose-500',
};

const GLOW = {
  blue:'shadow-blue-500/20', purple:'shadow-purple-500/20', indigo:'shadow-indigo-500/20',
  emerald:'shadow-emerald-500/20', teal:'shadow-teal-500/20', amber:'shadow-amber-500/20', rose:'shadow-rose-500/20',
};

function formatCell(val) {
  if (val === null || val === undefined) return <span className="text-zinc-400 italic text-xs">null</span>;
  if (typeof val === 'boolean') return <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${val?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{String(val)}</span>;
  if (typeof val === 'object') return <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{JSON.stringify(val)}</span>;
  const str = String(val);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">{new Date(str).toLocaleString()}</span>;
  if (str.length > 60) return <span className="font-mono text-xs break-all">{str.slice(0,60)}<span className="text-zinc-400">…</span></span>;
  return <span className="text-sm">{str}</span>;
}

/* ── Confirm Delete Modal ── */
function ConfirmModal({ row, tableKey, onConfirm, onCancel, deleting }) {
  const idVal = row?.id ?? '(no id)';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl w-full max-w-md p-6 animate-scale-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
          <XIcon className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">Delete Record</p>
            <p className="text-xs text-zinc-400">{TABLE_META[tableKey]?.label}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
          Are you sure you want to permanently delete this record?
        </p>
        <code className="block text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 text-red-600 dark:text-red-400 font-mono mb-5 break-all">
          id: {idVal}
        </code>
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-5">
          ⚠️ This action is permanent and cannot be undone. Cascading deletes may remove related records.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">
            Cancel
          </button>
          <button
            id="db-confirm-delete-btn"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium disabled:opacity-60 transition"
          >
            {deleting ? <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" /> : <Trash2Icon className="w-3.5 h-3.5" />}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Table View ── */
function TableView({ tableKey, rows, onDelete, canModifyDatabase }) {
 const [search, setSearch] = useState('');
const [sort, setSort] = useState({ col: null, dir: 'asc' });
const [page, setPage] = useState(1);
const [selectedUser, setSelectedUser] = useState('');
const workspaces = useSelector(state => state.workspace?.workspaces || []);

const userMap = useMemo(() => {
  const map = {};

  workspaces.forEach(ws => {
    ws.members?.forEach(m => {
      map[m.userId] = m.user?.name;
    });
  });

  return map;
}, [workspaces]);

const PER_PAGE = 15;

const columns = rows.length ? Object.keys(rows[0]) : [];
// Find whichever field exists
const userField =
  columns.includes('name') ? 'name' :
  columns.includes('ownerId') ? 'ownerId' :
  columns.includes('userId') ? 'userId' :
  columns.includes('assigneeId') ? 'assigneeId' :
  null;

const users = userField
  ? [...new Set(rows.map(row => row[userField]).filter(Boolean))]
  : [];


  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(row => columns.some(col => String(row[col] ?? '').toLowerCase().includes(q)));
  }, [rows, search, columns]);

  const sorted = useMemo(() => {
    if (!sort.col) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sort.col] ?? '').localeCompare(String(b[sort.col] ?? ''), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);
  const displayedRows = useMemo(() => {
  if (!selectedUser || !userField) return sorted;

  return sorted.filter(
    row => String(row[userField]) === String(selectedUser)
  );
}, [sorted, selectedUser, userField]);

 const totalPages = Math.ceil(displayedRows.length / PER_PAGE);

const paged = displayedRows.slice(
  (page - 1) * PER_PAGE,
  page * PER_PAGE
);

  const toggleSort = col => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
    setPage(1);
  };

  const exportCsv = () => {
  let exportRows = sorted;

  if (selectedUser && userField) {
    exportRows = sorted.filter(
      row => String(row[userField]) === String(selectedUser)
    );
  }

  if (!exportRows.length) return;

  const csvContent =
    columns.join(',') +
    '\n' +
    exportRows
      .map(r =>
        columns
          .map(c => JSON.stringify(r[c] ?? ''))
          .join(',')
      )
      .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv'
  });

  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `${tableKey}.csv`
  });

  a.click();
  URL.revokeObjectURL(a.href);
};

  if (!rows.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
      <DatabaseIcon className="w-10 h-10 mb-3 opacity-30" />
      <p className="text-sm">No records in this table</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id={`db-search-${tableKey}`}
            type="text"
            placeholder="Search all columns…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium tabular-nums">
  {displayedRows.length} / {rows.length} rows
</span>
  <select
  value={selectedUser}
  onChange={(e) => {
    setSelectedUser(e.target.value);
    setPage(1);
  }}
  className="px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
>
  <option value="">All Users</option>

  {users.map(user => (
   <option key={user} value={user}>
  {userMap[user] || user}
</option>
  ))}
</select>



        <button id={`db-export-${tableKey}`} onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">
          <DownloadIcon className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              {columns.map(col => (
                <th key={col} onClick={() => toggleSort(col)} className="px-4 py-3 font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors">
                  <div className="flex items-center gap-1">
                    {col}
                    {sort.col === col
                      ? sort.dir === 'asc' ? <ChevronUpIcon className="w-3 h-3 text-blue-500" /> : <ChevronDownIcon className="w-3 h-3 text-blue-500" />
                      : <div className="w-3 h-3 opacity-0" />}
                  </div>
                </th>
              ))}
              {canModifyDatabase && <th className="px-4 py-3 text-xs text-zinc-400 uppercase tracking-wider text-right">Action</th>}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2.5 max-w-xs">{formatCell(row[col])}</td>
                ))}
                {canModifyDatabase && (
                  <td className="px-4 py-2.5 text-right">
                    <button
                      id={`db-delete-${tableKey}-${i}`}
                      onClick={() => onDelete(row)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2Icon className="w-3 h-3" /> Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-400">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <button id={`db-prev-${tableKey}`} disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">← Prev</button>
            {Array.from({length:Math.min(totalPages,5)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`px-3 py-1.5 text-xs rounded-lg border transition ${page===p?'bg-blue-500 border-blue-500 text-white':'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}>{p}</button>
            ))}
            <button id={`db-next-${tableKey}`} disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function DatabaseViewer() {
  const { canAccessDatabaseViewer, canModifyDatabase, role } = useRBAC();
  const dispatch = useDispatch();
  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);

  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeTable, setActiveTable] = useState('users');
  const [lastFetched, setLastFetched] = useState(null);
  const [confirm,     setConfirm]     = useState(null); // { row, tableKey }
  const [deleting,    setDeleting]    = useState(false);
  const [seeding,     setSeeding]     = useState(false);
  const [resetting,   setResetting]   = useState(false);
  const [toast,       setToast]       = useState(null); // { msg, type }

  const [adminId,     setAdminId]     = useState('');
  const [adminPw,     setAdminPw]     = useState('');
  const [authError,   setAuthError]   = useState('');
  const [showAuthForm,setShowAuthForm] = useState(false);

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    setAuthError('');
    if (adminId.trim().toLowerCase() === 'admin' && (adminPw === 'admin' || adminPw === 'admin123')) {
      localStorage.setItem('admin_bypass', 'true');
      showToast("Access Granted. Unlocking Admin IT Panel...", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setAuthError("Invalid Admin ID or Passcode.");
    }
  };

  const handleAdminLock = () => {
    localStorage.removeItem('admin_bypass');
    showToast("Console locked. Restoring role boundaries...", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSeed = async () => {
    if (!currentWorkspace?.id) return;
    setSeeding(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/db/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: currentWorkspace.id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to seed demo data");
      
      showToast("Demo projects and tasks seeded successfully!");
      fetchData();
      dispatch(fetchWorkspaces()); // Sync Redux workspaces!
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!currentWorkspace?.id) return;
    if (!window.confirm("Are you absolutely sure you want to wipe all projects, tasks, and mock members to reset this workspace?")) return;
    setResetting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/db/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: currentWorkspace.id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to reset workspace");

      showToast("Workspace wiped clean successfully!");
      fetchData();
      dispatch(fetchWorkspaces()); // Sync Redux workspaces!
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setResetting(false);
    }
  };

  const fetchData = async () => {
    if (!canAccessDatabaseViewer) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/db`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setLastFetched(new Date());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    const { row, tableKey } = confirm;
    if (!row.id) { showToast('Record has no id field — cannot delete.', 'error'); setConfirm(null); return; }
    setDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/db/${tableKey}/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      // Remove locally for instant feedback
      setData(prev => ({ ...prev, [tableKey]: prev[tableKey].filter(r => r.id !== row.id) }));
      showToast(`Deleted record from ${TABLE_META[tableKey]?.label}`);
      setConfirm(null);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setDeleting(false); }
  };

  useEffect(() => { 
    if (canAccessDatabaseViewer) {
      fetchData(); 
    }
  }, [canAccessDatabaseViewer]);

  if (!canAccessDatabaseViewer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center shadow-lg shadow-red-500/10 mb-6">
          <ShieldAlertIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2" style={{fontFamily:'Outfit,sans-serif'}}>
          Access Denied
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          You do not have the required permissions to view the raw system database. Your current role is <span className="font-bold text-red-500 font-mono capitalize">{role?.replace('_', ' ').toLowerCase()}</span>.
        </p>
        <div className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 font-mono mb-6">
          Required Roles: Admin IT, IT, Manager, Team Lead
        </div>

        {/* Access Denied Unlock Console Form */}
        {!showAuthForm ? (
          <button 
            id="db-prompt-unlock-btn"
            onClick={() => setShowAuthForm(true)} 
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            🔓 Unlock Console
          </button>
        ) : (
          <form onSubmit={handleAdminUnlock} className="w-full p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 text-left space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white flex items-center gap-1">
              🔑 Authenticate Administrator
            </h3>
            
            {authError && (
              <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg px-2.5 py-1.5">
                {authError}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Admin ID</label>
              <input
                id="db-admin-id-input"
                type="text"
                placeholder="e.g. admin"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Admin Password</label>
              <input
                id="db-admin-pw-input"
                type="password"
                placeholder="e.g. admin"
                value={adminPw}
                onChange={e => setAdminPw(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button" 
                onClick={() => { setShowAuthForm(false); setAuthError(''); }}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button 
                id="db-submit-unlock-btn"
                type="submit" 
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Submit Unlock
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  const tableKeys = Object.keys(TABLE_META);
  const totalRows = data ? tableKeys.reduce((acc,k) => acc + (data[k]?.length ?? 0), 0) : 0;

  return (
    <div className="min-h-full animate-fade-up">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-scale-in ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircleIcon className="w-4 h-4" /> : <span>✓</span>}
          {toast.msg}
        </div>
      )}

      {/* Confirm Modal */}
      {confirm && (
        <ConfirmModal
          row={confirm.row}
          tableKey={confirm.tableKey}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <DatabaseIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white" style={{fontFamily:'Outfit,sans-serif'}}>Admin IT Panel</h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-12">
              System diagnostics and raw data control deck for <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-purple-600 dark:text-purple-400">dev.db</code>
              {lastFetched && <span className="ml-2 text-zinc-400">· Last Refreshed: {lastFetched.toLocaleTimeString()}</span>}
            </p>
          </div>
          <button id="db-refresh-btn" onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all">
            <RefreshCwIcon className={`w-4 h-4 ${loading?'animate-spin':''}`} />
            {loading ? 'Refreshing…' : 'Refresh Data'}
          </button>
        </div>

      {/* System Diagnostics & Control Deck */}
      <div className="mb-6 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 bg-gradient-to-br from-white/90 to-zinc-50/50 dark:from-zinc-900/90 dark:to-zinc-950/50 backdrop-blur-md shadow-sm relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-24 -top-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Diagnostics Section */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <CpuIcon className="w-4 h-4 text-purple-500 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">System Diagnostics</h2>
              </div>
              {localStorage.getItem('admin_bypass') === 'true' && (
                <button 
                  id="db-lock-console-btn"
                  onClick={handleAdminLock}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer select-none"
                >
                  <Lock className="w-3 h-3" /> Lock Console
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stat 1: Environment & Engine */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/40 border border-zinc-200/30 dark:border-zinc-700/30">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Engine & Environment</p>
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">Prisma ORM · Dev Mode</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">SQLite File: <span className="font-mono bg-zinc-200/40 dark:bg-zinc-800/60 px-1 py-0.2 rounded text-[9px]">dev.db</span></p>
                </div>
              </div>

              {/* Stat 2: Active Target Context */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/40 border border-zinc-200/30 dark:border-zinc-700/30">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <LayersIcon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Target Workspace</p>
                  {currentWorkspace ? (
                    <>
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5 truncate">{currentWorkspace.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate font-mono">ID: {currentWorkspace.id.slice(0, 8)}...</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-zinc-500 mt-0.5">No active workspace selected</p>
                      <p className="text-[9px] text-amber-500 font-medium mt-0.5">⚠️ Select workspace from sidebar first</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical divider on desktop */}
          {canModifyDatabase && <div className="hidden lg:block w-px h-16 bg-zinc-200 dark:bg-zinc-800" />}

          {/* Controls Section */}
          {canModifyDatabase && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-[420px] flex-shrink-0">
              {/* Seed Demo Data Button */}
              <div className="flex-1 group">
                <button
                  id="db-seed-btn"
                  onClick={handleSeed}
                  disabled={seeding || loading || !currentWorkspace?.id}
                  className="w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-gradient-to-b from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 disabled:opacity-40 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none shadow-sm"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {seeding ? (
                      <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FolderPlusIcon className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                    )}
                    {seeding ? 'Seeding...' : 'Seed Demo Data'}
                  </div>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 text-center font-medium leading-tight mt-0.5">
                    Populate active workspace with mock tasks & members
                  </span>
                </button>
              </div>

              {/* Reset Workspace Button */}
              <div className="flex-1 group">
                <button
                  id="db-reset-btn"
                  onClick={handleReset}
                  disabled={resetting || loading || !currentWorkspace?.id}
                  className="w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-red-200 dark:border-red-800/40 bg-gradient-to-b from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 text-red-600 dark:text-red-400 hover:border-red-300 dark:hover:border-red-800 disabled:opacity-40 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none shadow-sm"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {resetting ? (
                      <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcwIcon className="w-3.5 h-3.5 text-red-500 group-hover:rotate-45 transition-transform" />
                    )}
                    {resetting ? 'Resetting...' : 'Reset Workspace'}
                  </div>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 text-center font-medium leading-tight mt-0.5">
                    Wipe projects, tasks, comments & mock roles clean
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Stats */}
        {data && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {tableKeys.map(key => {
              const meta = TABLE_META[key]; const Icon = meta.icon;
              return (
                <button key={key} id={`db-stat-${key}`} onClick={() => setActiveTable(key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.02] ${activeTable===key?`border-2 ${RING[meta.color]} bg-white dark:bg-zinc-900 shadow-lg ${GLOW[meta.color]}`:'border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600'}`}>
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="text-xl font-bold text-zinc-900 dark:text-white tabular-nums">{data[key]?.length ?? 0}</span>
                  <span className="text-[10px] text-zinc-400 font-medium leading-tight">{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
          <AlertCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div><p className="font-semibold text-sm">Failed to fetch database</p><p className="text-xs mt-0.5 opacity-80">{error}</p></div>
        </div>
      )}

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg animate-float">
            <DatabaseIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex gap-1">
            {[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
          </div>
          <p className="text-sm text-zinc-400">Fetching all tables from dev.db…</p>
        </div>
      ) : data ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-700/60 no-scrollbar">
            {tableKeys.map(key => {
              const meta = TABLE_META[key]; const Icon = meta.icon;
              return (
                <button key={key} id={`db-tab-${key}`} onClick={() => setActiveTable(key)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${activeTable===key?'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/10':'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${BADGE[meta.color]}`}>{data[key]?.length ?? 0}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {data[activeTable] !== undefined && (
              <TableView
                key={activeTable}
                tableKey={activeTable}
                rows={data[activeTable]}
                onDelete={row => setConfirm({ row, tableKey: activeTable })}
                canModifyDatabase={canModifyDatabase}
              />
            )}
          </div>
        </div>
      ) : null}

      {data && (
        <p className="mt-4 text-center text-xs text-zinc-400">
          {tableKeys.length} tables · {totalRows} total rows · SQLite dev.db
        </p>
      )}
    </div>
  );
}
