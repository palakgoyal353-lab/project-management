import { FolderOpen, CheckCircle, ListTodo, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AnimatedNumber({ value }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let current = 0;
        if (value === 0) { setDisplay(0); return; }
        const increment = Math.max(1, Math.floor(value / 30));
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setDisplay(value); clearInterval(timer); }
            else setDisplay(current);
        }, 20);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
}

export default function StatsGrid() {
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);

    const [stats, setStats] = useState({
        totalProjects: 0, activeProjects: 0,
        completedTasks: 0, totalTasks: 0, overdueIssues: 0,
    });

    useEffect(() => {
        if (!currentWorkspace) return;
        const allTasks = currentWorkspace.projects?.flatMap(p => p.tasks || []) || [];
        setStats({
            totalProjects: currentWorkspace.projects?.length || 0,
            activeProjects: currentWorkspace.projects?.filter(p => p.status !== "CANCELLED" && p.status !== "COMPLETED").length || 0,
            completedTasks: allTasks.filter(t => t.status === 'DONE').length,
            totalTasks: allTasks.length,
            overdueIssues: allTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE').length,
        });
    }, [currentWorkspace]);

    const completionRate = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

    const cards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats.totalProjects,
            subtitle: `${stats.activeProjects} active`,
            iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
            iconColor: "text-blue-500",
            gradient: "from-blue-500/5 to-transparent",
            border: "hover:border-blue-200 dark:hover:border-blue-500/30",
            trend: "+2 this month",
            trendUp: true,
        },
        {
            icon: CheckCircle,
            title: "Tasks Completed",
            value: stats.completedTasks,
            subtitle: `${completionRate}% completion rate`,
            iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
            iconColor: "text-emerald-500",
            gradient: "from-emerald-500/5 to-transparent",
            border: "hover:border-emerald-200 dark:hover:border-emerald-500/30",
            trend: `${completionRate}% rate`,
            trendUp: completionRate >= 50,
        },
        {
            icon: ListTodo,
            title: "Total Tasks",
            value: stats.totalTasks,
            subtitle: "across all projects",
            iconBg: "bg-purple-500/10 dark:bg-purple-500/15",
            iconColor: "text-purple-500",
            gradient: "from-purple-500/5 to-transparent",
            border: "hover:border-purple-200 dark:hover:border-purple-500/30",
            trend: `${stats.totalTasks - stats.completedTasks} remaining`,
            trendUp: null,
        },
        {
            icon: AlertTriangle,
            title: "Overdue Tasks",
            value: stats.overdueIssues,
            subtitle: "require attention",
            iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
            iconColor: "text-amber-500",
            gradient: "from-amber-500/5 to-transparent",
            border: "hover:border-amber-200 dark:hover:border-amber-500/30",
            trend: stats.overdueIssues > 0 ? "Needs attention" : "All on track",
            trendUp: stats.overdueIssues === 0,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ icon: Icon, title, value, subtitle, iconBg, iconColor, gradient, border, trend, trendUp }, i) => (
                <div
                    key={i}
                    className={`relative overflow-hidden bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 ${border} rounded-2xl shadow-sm card-hover transition-colors animate-fade-up delay-${(i+1)*100}`}
                >
                    {/* Gradient wash */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />

                    <div className="relative p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                <Icon size={18} className={iconColor} />
                            </div>
                            {trendUp !== null && (
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp
                                    ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
                                    : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'}`}>
                                    {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                </div>
                            )}
                        </div>

                        <p className="text-3xl font-bold text-zinc-800 dark:text-white mb-1 font-display">
                            <AnimatedNumber value={value} />
                        </p>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{title}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{subtitle}</p>

                        {/* Subtle bottom border accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${iconColor.replace('text-', 'bg-')} opacity-30`} />
                    </div>
                </div>
            ))}
        </div>
    );
}
