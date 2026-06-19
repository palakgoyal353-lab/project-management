import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Moon, Monitor, Sun, Save, Crown, Eye, Clock } from 'lucide-react';
import { useRBAC, getPermissionMatrix } from '../hooks/useRBAC';
import { useUser } from '@clerk/react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme as setReduxTheme } from '../feature/themeSlice';

const Settings = () => {
    const rbac = useRBAC();
    const {
        role, isAdmin, isLeader, isWorker,
    } = rbac;

    const matrix = getPermissionMatrix();

    const { isLoaded, user } = useUser();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (isLoaded && user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.primaryEmailAddress?.emailAddress || '');
        }
    }, [isLoaded, user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await user.update({
                firstName: firstName,
                lastName: lastName,
            });
            setSuccessMsg('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const [simulateAdmin, setSimulateAdmin] = useState(
        localStorage.getItem('admin_bypass') === 'true'
    );
    const firstRender = useRef(true);
    
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        projectUpdates: true,
        mentions: true,
    });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (simulateAdmin) {
            localStorage.setItem('admin_bypass', 'true');
        } else {
            localStorage.removeItem('admin_bypass');
        }
        window.location.reload();
    }, [simulateAdmin]);

    const handleNotificationToggle = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const sectionClasses =
        'bg-white dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm';
    const headerClasses =
        'text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2';
    const labelClasses =
        'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2';
    const inputClasses =
        'w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-zinc-100 transition-all';

    // Permission categories for display (admin toggles are editable)
    const adminOnlyPerms = [
        { key: 'canCreateWorkspace', label: 'Create Workspace', value: matrix.canCreateWorkspace?.admin ?? false },
        { key: 'canManageWorkspaceSettings', label: 'Manage Workspace Settings', value: matrix.canManageWorkspaceSettings?.admin ?? false },
        { key: 'canInviteMembers', label: 'Invite Members', value: matrix.canInviteMembers?.admin ?? false },
        { key: 'canDeleteWorkspace', label: 'Delete Workspace', value: matrix.canDeleteWorkspace?.admin ?? false },
        { key: 'canCreateProject', label: 'Create Project', value: matrix.canCreateProject?.admin ?? false },
        { key: 'canDeleteProject', label: 'Delete Project', value: matrix.canDeleteProject?.admin ?? false },
        { key: 'canModifyDatabase', label: 'Modify Database (Seed / Reset / Delete)', value: matrix.canModifyDatabase?.admin ?? false },
    ];

    const updatePermission = (roleKey, permKey, enabled) => {
        const current = getPermissionMatrix();
        const next = {
            ...current,
            [permKey]: {
                ...current[permKey],
                [roleKey]: enabled,
            },
        };
        localStorage.setItem('rbac_company_rules', JSON.stringify(next));
        window.location.reload();
    };

    const leaderPerms = [
    {
        key: 'canCreateTask',
        label: 'Create Task',
        value: matrix.canCreateTask?.leader ?? false
    },
    {
        key: 'canDeleteTask',
        label: 'Delete Task',
        value: matrix.canDeleteTask?.leader ?? false
    },
    {
        key: 'canManageProjectSettings',
        label: 'Manage Project Settings',
        value: matrix.canManageProjectSettings?.leader ?? false
    },
    {
        key: 'canAccessDatabaseViewer',
        label: 'View Database (Read Only)',
        value: matrix.canAccessDatabaseViewer?.leader ?? false
    },
    {
        key: 'canAccessTeamPage',
        label: 'Access Team Page',
        value: matrix.canAccessTeamPage?.leader ?? false
    },

    // NEW PERMISSIONS
    {
        key: 'canInviteMembers',
        label: 'Invite Members',
        value: matrix.canInviteMembers?.leader ?? false
    },
    {
        key: 'canCreateProject',
        label: 'Create Projects',
        value: matrix.canCreateProject?.leader ?? false
    }
];

    const workerPerms = [
        { key: 'canViewProjects', label: 'View Projects & Timelines', value: matrix.canViewProjects?.worker ?? false },
        { key: 'canViewDashboard', label: 'View Dashboard Overview', value: matrix.canViewDashboard?.worker ?? false },
        { key: 'canViewCalendar', label: 'View Calendar & Dates', value: matrix.canViewCalendar?.worker ?? false },
    ];

    // Role badge styles
    const roleBadge = isAdmin
        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
        : isLeader
            ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
            : 'bg-gradient-to-r from-zinc-400 to-zinc-500 text-white';

    const roleIcon = isAdmin ? Crown : isLeader ? Eye : Clock;
    const RoleIcon = roleIcon;

    const RolePermRow = ({ roleKey, permKey, label, value }) => {
        const toggle = () => updatePermission(roleKey, permKey, !value);
        return (
            <div
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all ${value
                        ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/80 dark:bg-emerald-900/15'
                        : 'border-zinc-200 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/30'
                    }`}
            >
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>

                <div className="flex items-center gap-3">
                    <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${value
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400'
                            }`}
                    >
                        {value ? '✓ Enabled' : '✗ Disabled'}
                    </span>

                    <button
                        type="button"
                        onClick={toggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${value
                                ? 'bg-emerald-500'
                                : 'bg-zinc-200 dark:bg-zinc-700'
                            }`}
                        aria-label={`Toggle ${label}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
            </div>
        );
    };


    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Profile Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <User className="size-5 text-blue-500" />
                    Profile Details
                </h2>
                <form onSubmit={handleSaveProfile} className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>First Name</label>
                        <input
                            type="text"
                            className={inputClasses}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Last Name</label>
                        <input
                            type="text"
                            className={inputClasses}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Email Address</label>
                        <input
                            type="email"
                            className={`${inputClasses} opacity-60 cursor-not-allowed`}
                            value={email}
                            disabled
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                            Email is managed via your authentication provider.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="md:col-span-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-lg">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="md:col-span-2 text-sm text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-lg">
                            {successMsg}
                        </div>
                    )}

                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={saving || !isLoaded || !user}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium cursor-pointer"
                        >
                            <Save className="size-4" /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </section>

            {/* ════════════════════════════════════════════════════════════════════
          RBAC — Role-Based Access Control
         ════════════════════════════════════════════════════════════════════ */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <Shield className="size-5 text-purple-500" />
                    Role-Based Access Control
                </h2>

                {/* Current role */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Your Role:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${roleBadge}`}>
                        <RoleIcon className="size-3.5" />
                        {role}
                    </span>
                </div>

                {/* ── Admin-Only Permissions ── */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Crown className="size-4" /> Admin — Enable / Disable
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {adminOnlyPerms.map((p) => (
                            <RolePermRow key={p.key} roleKey="admin" permKey={p.key} label={p.label} value={p.value} />
                        ))}
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem('rbac_company_rules');
                                window.location.reload();
                            }}
                            className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                        >
                            Reset Admin Toggles
                        </button>
                    </div>
                </div>


                {/* ── Leader Permissions ── */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Eye className="size-4" /> Leader — View Database & Minor Permissions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {leaderPerms.map((p) => (
                            <RolePermRow key={p.key} roleKey="leader" permKey={p.key} label={p.label} value={p.value} />
                        ))}
                    </div>
                </div>

                {/* ── Worker Permissions ── */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clock className="size-4" /> Worker — Timing, Project & Dates Only
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {workerPerms.map((p) => (
                            <RolePermRow key={p.key} roleKey="worker" permKey={p.key} label={p.label} value={p.value} />
                        ))}
                    </div>
                </div>

                {/* Admin simulate toggle */}
                <div className="flex items-center justify-between py-4 border-t border-zinc-100 dark:border-zinc-700">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Simulate Admin Access
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Override your role to Admin for testing. Page reloads automatically.
                        </p>
                    </div>
                    <button
                        onClick={() => setSimulateAdmin((prev) => !prev)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${simulateAdmin ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${simulateAdmin ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </section>

            {/* Appearance Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <Monitor className="size-5 text-purple-500" />
                    Appearance
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Select your preferred theme for the dashboard.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark', icon: Moon, label: 'Dark' },
                        { id: 'system', icon: Monitor, label: 'System' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => dispatch(setReduxTheme(t.id))}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${theme === t.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                                }`}
                        >
                            <t.icon className="size-6 mb-2" />
                            <span className="text-sm font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Notifications Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <Bell className="size-5 text-amber-500" />
                    Notifications
                </h2>
                <div className="space-y-6">
                    {[
                        { key: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and updates via email.' },
                        { key: 'push', title: 'Push Notifications', desc: 'Receive real-time alerts in your browser.' },
                        { key: 'projectUpdates', title: 'Project Updates', desc: 'Get notified when someone updates a project you follow.' },
                        { key: 'mentions', title: 'Mentions & Comments', desc: 'Get notified when someone mentions you in a task.' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleNotificationToggle(item.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${notifications[item.key] ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </section>


            {/* Security Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <Shield className="size-5 text-emerald-500" />
                    Security
                </h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Manage your password and security preferences.
                    </p>
                    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Last changed 3 months ago</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                            Change Password
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
