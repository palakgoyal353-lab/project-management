import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Monitor, Sun, Save } from 'lucide-react';

const Settings = () => {
    const [theme, setTheme] = useState('system');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        projectUpdates: true,
        mentions: true,
    });

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sectionClasses = "bg-white dark:bg-zinc-800/60 dark:bg-gradient-to-br dark:from-zinc-800/80 dark:to-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm";
    const headerClasses = "text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2";
    const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2";
    const inputClasses = "w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 text-zinc-900 dark:text-zinc-100 transition-all";

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <User className="size-5 text-blue-500" />
                    Profile Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>First Name</label>
                        <input type="text" className={inputClasses} defaultValue="John" />
                    </div>
                    <div>
                        <label className={labelClasses}>Last Name</label>
                        <input type="text" className={inputClasses} defaultValue="Doe" />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Email Address</label>
                        <input type="email" className={inputClasses} defaultValue="john.doe@example.com" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                            <Save className="size-4" /> Save Profile
                        </button>
                    </div>
                </div>
            </section>

            {/* Appearance Section */}
            <section className={sectionClasses}>
                <h2 className={headerClasses}>
                    <Monitor className="size-5 text-purple-500" />
                    Appearance
                </h2>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Select your preferred theme for the dashboard.</p>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 'light', icon: Sun, label: 'Light' },
                            { id: 'dark', icon: Moon, label: 'Dark' },
                            { id: 'system', icon: Monitor, label: 'System' },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${theme === t.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                <t.icon className="size-6 mb-2" />
                                <span className="text-sm font-medium">{t.label}</span>
                            </button>
                        ))}
                    </div>
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
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage your password and security preferences.</p>
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
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Two-Factor Authentication</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Add an extra layer of security to your account</p>
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
