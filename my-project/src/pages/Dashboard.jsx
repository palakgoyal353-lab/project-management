import { Plus, TrendingUp, Layers, CheckCircle2, Clock, Zap, BarChart2, Users, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useUser } from '@clerk/react'
import StatsGrid from '../components/StatsGrid'
import ProjectOverview from '../components/ProjectOverview'
import RecentActivity from '../components/RecentActivity'
import TasksSummary from '../components/TasksSummary'
import CreateProjectDialog from '../components/CreateProjectDialog'

// Animated number counter
function CountUp({ end, duration = 1200 }) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (end === 0) return
        let start = 0
        const step = Math.ceil(end / (duration / 16))
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(start)
        }, 16)
        return () => clearInterval(timer)
    }, [end])
    return <span>{count}</span>
}

// Mini sparkline SVG
function Sparkline({ data = [], color = '#3b82f6', height = 32 }) {
    if (!data.length) return null
    const max = Math.max(...data, 1)
    const w = 80, h = height
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <defs>
                <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
        </svg>
    )
}

// Donut progress ring
function DonutRing({ percent, size = 56, stroke = 5, color = '#3b82f6', bg = '#e2e8f0' }) {
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const dash = (percent / 100) * circ
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} className="dark:stroke-zinc-700" />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
    )
}

const Dashboard = () => {
    const { user } = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { currentWorkspace } = useSelector(state => state.workspace)

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const displayName = user?.firstName || user?.fullName?.split(' ')[0] || 'there'

    const allTasks = currentWorkspace?.projects?.flatMap(p => p.tasks || []) || []
    const totalProjects = currentWorkspace?.projects?.length || 0
    const totalMembers = currentWorkspace?.members?.length || 0
    const completedTasks = allTasks.filter(t => t.status === 'DONE').length
    const inProgress = allTasks.filter(t => t.status === 'IN_PROGRESS').length
    const overdue = allTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE').length
    const completionRate = allTasks.length ? Math.round((completedTasks / allTasks.length) * 100) : 0

    // Fake sparkline data from task counts per project
    const sparkData = currentWorkspace?.projects?.map(p => p.tasks?.length || 0) || [0,2,1,3,2,4,3]

    const heroStats = [
        { icon: CheckCircle2, label: 'Done today', value: completedTasks, color: '#34d399', spark: [1,2,3,2,4,3,5] },
        { icon: Clock,        label: 'In progress', value: inProgress,    color: '#f59e0b', spark: [3,2,4,3,2,4,2] },
        { icon: TrendingUp,   label: 'Overdue',     value: overdue,       color: '#f87171', spark: [2,3,1,2,3,1,2] },
        { icon: Users,        label: 'Members',     value: totalMembers,  color: '#a78bfa', spark: [1,1,2,2,3,3,3] },
    ]

    return (
        <div className='max-w-6xl mx-auto space-y-8'>

            {/* ── Hero Banner ───────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl animate-fade-up" style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 40%, #312e81 70%, #4c1d95 100%)'
            }}>
                {/* Decorative orbs */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, white, transparent)' }} />

                <div className="relative p-6 lg:p-10">
                    {/* Top row */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold glass text-blue-200">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                    </span>
                                    Live Dashboard
                                </span>
                                <span className="text-blue-300/60 text-xs">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1" style={{fontFamily:'Outfit,Inter,sans-serif'}}>
                                {greeting}, <span className="gradient-text">{displayName}</span> 👋
                            </h1>
                            <p className="text-blue-200/70 text-sm">
                                {currentWorkspace
                                    ? `${currentWorkspace.name} · ${totalProjects} projects · ${allTasks.length} tasks`
                                    : "Here's your workspace overview"}
                            </p>
                        </div>

                        {/* Completion ring */}
                        <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
                            <div className="relative">
                                <DonutRing percent={completionRate} size={64} stroke={6} color="#34d399" bg="rgba(255,255,255,0.1)" />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{completionRate}%</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Overall Progress</p>
                                <p className="text-blue-200/70 text-xs">{completedTasks} of {allTasks.length} tasks</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {heroStats.map(({ icon: Icon, label, value, color, spark }, i) => (
                            <div key={label}
                                className={`glass rounded-xl p-4 animate-fade-up delay-${(i+1)*100} card-hover`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
                                        <Icon className="size-4" style={{ color }} />
                                    </div>
                                    <Sparkline data={spark} color={color} height={24} />
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    <CountUp end={value} />
                                </p>
                                <p className="text-blue-200/70 text-xs mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
                        >
                            <Plus size={16} /> New Project
                        </button>
                        <div className="flex items-center gap-1.5 text-blue-200/60 text-sm">
                            <Layers size={14} />
                            <span>{totalProjects} active project{totalProjects !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            {/* ── Stats Grid ────────────────────────────────── */}
            <div className="animate-fade-up delay-200">
                <StatsGrid />
            </div>

            {/* ── Main Grid ─────────────────────────────────── */}
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-up delay-300">
                <div className="lg:col-span-2 space-y-6">
                    <ProjectOverview />
                    <RecentActivity />
                </div>
                <div className="space-y-6">
                    <TasksSummary />
                    {/* Quick Insights Card */}
                    <QuickInsights projects={currentWorkspace?.projects || []} />
                </div>
            </div>
        </div>
    )
}

// Quick Insights sidebar card
function QuickInsights({ projects }) {
    const statusCounts = projects.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1
        return acc
    }, {})

    const statuses = [
        { key: 'ACTIVE',    label: 'Active',    color: '#34d399', bg: 'bg-emerald-500' },
        { key: 'PLANNING',  label: 'Planning',  color: '#60a5fa', bg: 'bg-blue-500' },
        { key: 'ON_HOLD',   label: 'On Hold',   color: '#f59e0b', bg: 'bg-amber-500' },
        { key: 'COMPLETED', label: 'Completed', color: '#a78bfa', bg: 'bg-purple-500' },
        { key: 'CANCELLED', label: 'Cancelled', color: '#f87171', bg: 'bg-red-500' },
    ]
    const total = projects.length || 1

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/60 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                    <BarChart2 className="size-4 text-purple-500" />
                </div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">Project Insights</h3>
            </div>

            <div className="space-y-3">
                {statuses.map(({ key, label, color, bg }) => {
                    const count = statusCounts[key] || 0
                    const pct = Math.round((count / total) * 100)
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between text-xs mb-1">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${bg}`} />
                                    <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                                </div>
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{count}</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${pct}%`, background: color }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {projects.length === 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-4">No projects yet</p>
            )}
        </div>
    )
}

export default Dashboard
