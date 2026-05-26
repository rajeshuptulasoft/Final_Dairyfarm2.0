import { useState, useEffect, useRef } from 'react';
import { dashboardAPI, notificationsAPI } from '../services/api';
import { mapDashboardResponse } from '../utils/dashboardData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Beef, Milk, IndianRupee, Apple, ArrowUpRight, ArrowDownRight,
  Bell, Syringe, Activity, TrendingUp, ExternalLink,
  CalendarDays, Clock, Sunrise, BarChart3, Sparkles,
  ChevronRight, Droplets, Wind, TreePine
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };
const itemScale = { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } };
const slideLeft = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };
const slideRight = { hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

const charVariants = (i) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
});

const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip-value" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </motion.div>
  );
};

function AnimatedCounter({ value, suffix = '', duration = 1.2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = performance.now();
        const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ''));
        const isFloat = String(value).includes('.');
        const animate = (t) => {
          const p = Math.min((t - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = eased * numVal;
          setCount(isFloat ? current.toFixed(1) : Math.floor(current));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        ob.disconnect();
      }
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    dashboardAPI
      .get()
      .then((res) => setData(mapDashboardResponse(res.data)))
      .catch(() => setData(mapDashboardResponse({})));
    notificationsAPI.list().then(res => setNotifs(res.data.unread)).catch(() => {
      setNotifs([
        { id: 1, title: 'Vaccination Due', message: 'Cow #1892 needs booster shot' },
        { id: 2, title: 'Low Feed Stock', message: 'Hay supply running low' },
      ]);
    });

    const clock = setInterval(() => setTime(new Date()), 30000);

    return () => { clearInterval(clock); };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5">
          <div className="loader-ring" />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Loading your farm data</p>
            <div className="flex gap-1 mt-2 justify-center">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const milkChange = data.milkChange ?? 0;
  const feedStock = data.feedStock ?? 0;

  const stats = [
    { label: 'Total Animals', value: data.totalAnimals ?? 0, icon: Beef, change: 'Active herd', up: true, gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)', },
    { label: "Today's Milk", value: `${data.todaysMilk || 0} L`, icon: Milk, change: `${milkChange >= 0 ? '+' : ''}${milkChange}% vs prior day`, up: milkChange >= 0, gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)', },
    { label: 'Month Revenue', value: `₹${(data.monthRevenue || 0).toLocaleString()}`, icon: IndianRupee, change: 'This month', up: true, gradient: 'linear-gradient(135deg,#34d399,#22c55e)', },
    { label: 'Feed Stock', value: feedStock > 0 ? `${Math.round(feedStock)} units` : 'Empty', icon: Apple, change: feedStock > 0 ? 'In stock entries' : 'No stock logged', up: feedStock > 0, gradient: feedStock > 0 ? 'linear-gradient(135deg,#34d399,#22c55e)' : 'linear-gradient(135deg,#f87171,#ef4444)', },
  ];

  const quickActions = [
    { icon: Milk, label: 'Record Milk Yield', sub: 'Log today\'s production', color: '#3b82f6', bg: 'rgba(59,130,246,.1)', border: 'rgba(59,130,246,.2)', href: '/muktifarm/admin/milk/entry' },
    { icon: Syringe, label: 'Vaccinations Due', sub: `${data.upcomingVaccinations || 0} pending schedule`, color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', border: 'rgba(139,92,246,.2)', href: '/muktifarm/admin/vaccinations' },
    { icon: Bell, label: 'Notifications', sub: `${Math.max(notifs.length, data.pendingNotifications || 0)} pending alerts`, color: '#f59e0b', bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.2)', href: '#' },
    { icon: Activity, label: 'Health Check', sub: 'Review animal wellness', color: '#ec4899', bg: 'rgba(236,72,153,.1)', border: 'rgba(236,72,153,.2)', href: '/muktifarm/admin/health' },
  ];

  const titleChars = 'Dairy Dashboard'.split('');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="dashboard-page">

      {/* ── Header with character reveal ── */}
      <motion.div variants={fadeUp} className="dashboard-header">
        <div className="dashboard-header-left">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="dashboard-live">
            <span className="live-dot" />
            <span>Live Dashboard</span>
            <span className="header-sep" />
            <CalendarDays size={12} />
            <span>{time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="header-sep" />
            <Clock size={12} />
            <span>{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </motion.div>
          <h1 className="page-title">
            {titleChars.map((ch, i) => (
              <motion.span
                key={i}
                variants={charVariants(i)}
                initial="hidden"
                animate="show"
                className={ch === 'D' || ch === 'D' ? 'text-gradient' : ''}
                style={ch === ' ' ? { display: 'inline-block', width: '0.3em' } : {}}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="page-sub"
          >
            Real-time overview of your farm operations &amp; production metrics
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="dashboard-header-right"
        >
          <motion.button className="dash-btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <BarChart3 size={15} />
            <span>Generate Report</span>
          </motion.button>
          <motion.button className="dash-btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ExternalLink size={15} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Premium Farm Scene ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="admin-farm-scene"
      >
        <div className="admin-farm-sky">
          <div className="admin-farm-sun" />
          <div className="admin-sun-rays" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="admin-sky-sparkle" style={{
              top: `${10 + Math.random() * 50}%`,
              left: `${5 + Math.random() * 90}%`,
              width: `${2 + i % 3}px`, height: `${2 + i % 3}px`,
              background: ['rgba(255,255,255,.6)','rgba(250,204,21,.5)','rgba(147,197,253,.5)'][i % 3],
              animationDelay: `${-i * 0.7}s`,
            }} />
          ))}
          <div className="admin-farm-cloud admin-cloud-1" />
          <div className="admin-farm-cloud admin-cloud-2" />
          <div className="admin-farm-cloud admin-cloud-3" />
          <div className="admin-bird admin-bird-1" />
          <div className="admin-bird admin-bird-2" />
          <div className="admin-bird admin-bird-3" />
        </div>
        <div className="admin-farm-hills">
          <div className="admin-hill admin-hill-back" />
          <div className="admin-hill admin-hill-mid" />
          <div className="admin-hill admin-hill-front" />
        </div>
        <div className="admin-farm-barn">
          <div className="admin-barn-body" />
          <div className="admin-barn-roof" />
          <div className="admin-barn-door" />
          <div className="admin-barn-window admin-barn-window-l" />
          <div className="admin-barn-window admin-barn-window-r" />
          <div className="admin-barn-silo" />
        </div>
        <div className="admin-farm-fence">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="admin-fence-post" style={{ left: `${6 + i * 10}%` }} />
          ))}
          <div className="admin-fence-rail" />
          <div className="admin-fence-rail bottom" />
        </div>
        <div className="admin-farm-ground">
          <div className="admin-farm-grass">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="admin-grass-tuft" style={{
                left: `${3 + i * 6.2}%`,
                animationDelay: `${-i * 0.25}s`,
                height: `${8 + (i % 4) * 5}px`
              }} />
            ))}
          </div>
          <div className="admin-cow-container">
            <div className="admin-cow">
              <div className="admin-cow-body">
                <div className="admin-cow-spot large"></div>
                <div className="admin-cow-spot medium"></div>
                <div className="admin-cow-spot small"></div>
              </div>
              <div className="admin-cow-head">
                <div className="admin-cow-ear left"></div>
                <div className="admin-cow-ear right"></div>
                <div className="admin-cow-eye"></div>
                <div className="admin-cow-horn left"></div>
                <div className="admin-cow-horn right"></div>
              </div>
              <div className="admin-cow-leg front-left"><div className="admin-cow-hoof"></div></div>
              <div className="admin-cow-leg front-right"><div className="admin-cow-hoof"></div></div>
              <div className="admin-cow-leg back-left"><div className="admin-cow-hoof"></div></div>
              <div className="admin-cow-leg back-right"><div className="admin-cow-hoof"></div></div>
              <div className="admin-cow-tail"></div>
              <div className="admin-cow-udder">
                <div className="admin-cow-teat"></div>
                <div className="admin-cow-teat"></div>
                <div className="admin-cow-teat"></div>
                <div className="admin-cow-teat"></div>
              </div>
            </div>
          </div>
          <div className="admin-farm-trees">
            <div className="admin-farm-tree admin-tree-1" />
            <div className="admin-farm-tree admin-tree-2" />
            <div className="admin-farm-tree admin-tree-3" />
            <div className="admin-farm-tree admin-tree-4" />
            <div className="admin-farm-tree admin-tree-5" />
          </div>
          <div className="admin-farm-flowers">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="admin-farm-flower" style={{ left: `${5 + i * 12}%` }}>
                <div className={`admin-flower-dot admin-flower-dot-${(i % 4) + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards with staggered entrance ── */}
      <motion.div variants={item} className="dashboard-stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={itemScale}
            className="stat-card"
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div className="stat-card-glow" style={{ background: s.gradient }} />
            <div className="stat-card-shine" style={{ background: s.gradient }} />
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <motion.div
                  className="stat-icon-wrap"
                  style={{ background: s.gradient }}
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
                >
                  <s.icon size={20} className="stat-icon-svg" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className={`dash-chip ${s.up ? 'dash-chip-up' : 'dash-chip-down'}`}
                >
                  {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {s.change}
                </motion.span>
              </div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">
                {typeof s.value === 'string' && s.value.includes('₹')
                  ? <>₹<AnimatedCounter value={s.value.replace(/[₹,]/g, '')} /></>
                  : <AnimatedCounter value={s.value} />
                }
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts Row 1 ── */}
      <div className="dashboard-chart-grid">
        <motion.div variants={slideLeft} className="chart-card chart-card-wide">
          <div className="chart-card-header">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="chart-badge">
                <Droplets size={12} />
                <span>Production</span>
              </div>
              <h3 className="chart-title">Milk Production</h3>
              <p className="chart-sub">Last 7 days · morning vs evening yield</p>
            </motion.div>
            <div className="chart-legend">
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} />Total</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#93c5fd' }} />AM</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#6366f1' }} />PM</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={(data.milkChart || []).map(d => ({ ...d, day: d.day?.slice(0, 3) || d.date?.slice(5) }))}>
                <defs>
                  <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-soft)', strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#milkGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="morning" stroke="#93c5fd" fill="none" strokeWidth={1.5} strokeDasharray="4 3" />
                <Area type="monotone" dataKey="evening" stroke="#6366f1" fill="none" strokeWidth={1.5} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div variants={slideRight} className="chart-card">
          <div className="chart-card-header">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <div className="chart-badge">
                <TreePine size={12} />
                <span>Composition</span>
              </div>
              <h3 className="chart-title">Breed Distribution</h3>
              <p className="chart-sub">Herd composition share</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.breedDistribution || []}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4}
                  dataKey="count" nameKey="breed"
                  stroke="none"
                >
                  {(data.breedDistribution || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="dashboard-chart-grid">
        <motion.div variants={slideLeft} className="chart-card chart-card-wide">
          <div className="chart-card-header">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <div className="chart-badge">
                <TrendingUp size={12} />
                <span>Finance</span>
              </div>
              <h3 className="chart-title">Monthly Revenue vs Expenses</h3>
              <p className="chart-sub">Cash flow performance overview</p>
            </motion.div>
            <div className="chart-legend">
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} />Revenue</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} />Expenses</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyFinance || []} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,.06)' }} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div variants={slideRight} className="chart-card">
          <div className="chart-card-header">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <span className="chart-badge"><Sparkles size={12} /><span>Actions</span></span>
              <div className="flex items-center justify-between w-full mt-1">
                <h3 className="chart-title">Quick Actions</h3>
                {notifs.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="dash-chip dash-chip-warn"
                  >
                    {notifs.length} alerts
                  </motion.span>
                )}
              </div>
            </motion.div>
          </div>
          <div className="qa-list">
            {quickActions.map((q, i) => (
              <motion.button
                key={i}
                className="qa-item"
                variants={item}
                whileHover={{ x: 6, borderColor: q.border, boxShadow: `0 2px 12px ${q.bg}` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { if (q.href !== '#') window.location.href = q.href; }}
              >
                <motion.div
                  className="qa-icon"
                  style={{ background: q.bg, color: q.color }}
                  whileHover={{ rotate: 8, scale: 1.05 }}
                >
                  <q.icon size={18} />
                </motion.div>
                <div className="qa-content">
                  <p className="qa-label">{q.label}</p>
                  <p className="qa-sub">{q.sub}</p>
                </div>
                <ChevronRight size={14} className="qa-arrow" />
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {notifs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="dash-divider" />
                <h4 className="dash-section-label">Recent Alerts</h4>
                <div className="alert-list">
                  {notifs.slice(0, 3).map((n, idx) => (
                    <motion.div
                      key={n.id}
                      className="alert-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ x: 3 }}
                    >
                      <motion.div
                        className="alert-icon-wrap"
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                      >
                        <Bell size={12} />
                      </motion.div>
                      <div>
                        <p className="alert-title">{n.title}</p>
                        <p className="alert-msg">{n.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </motion.div>
  );
}
