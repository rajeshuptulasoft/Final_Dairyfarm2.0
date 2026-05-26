import { useState } from 'react';
import { reportsAPI } from '../services/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Download } from 'lucide-react';

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444'];

export default function Reports() {
  const [tab, setTab] = useState('milk');
  const [milkData, setMilkData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [filter, setFilter] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  const loadMilk = async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.milk({ from: filter.from || '2024-01-01', to: filter.to || new Date().toISOString().split('T')[0] });
      setMilkData(res.data);
    } catch {}
    setLoading(false);
  };

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.expenses({ from: filter.from || '2024-01-01', to: filter.to || new Date().toISOString().split('T')[0] });
      setExpenseData(res.data);
    } catch {}
    setLoading(false);
  };

  const handleFilter = () => {
    if (tab === 'milk') loadMilk();
    else loadExpenses();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyze farm performance</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['milk', 'expenses'].map(t => (
          <button key={t} onClick={() => { setTab(t); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-all ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <FileText size={16} className="inline mr-1.5" />{t} Report
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" className="input-field w-auto" value={filter.from} onChange={e => setFilter(f => ({...f, from: e.target.value}))} /></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" className="input-field w-auto" value={filter.to} onChange={e => setFilter(f => ({...f, to: e.target.value}))} /></div>
        <button onClick={handleFilter} className="btn-primary">Generate</button>
      </div>

      {tab === 'milk' && milkData && (
        <div className="space-y-6">
          {milkData.summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card"><p className="text-sm text-gray-500">Total Production</p><p className="text-xl font-bold">{parseFloat(milkData.summary.total || 0).toFixed(1)} L</p></div>
              <div className="stat-card"><p className="text-sm text-gray-500">Daily Avg</p><p className="text-xl font-bold">{parseFloat(milkData.summary.daily_avg || 0).toFixed(1)} L</p></div>
              <div className="stat-card"><p className="text-sm text-gray-500">Active Animals</p><p className="text-xl font-bold">{milkData.summary.animals || 0}</p></div>
            </div>
          )}
          <div className="card">
            <h3 className="font-semibold mb-4">Daily Milk Production</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={milkData.records || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="milk_date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total (L)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'expenses' && expenseData && (
        <div className="space-y-6">
          {expenseData.summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card"><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold text-red-600">₹{parseFloat(expenseData.summary.total || 0).toLocaleString()}</p></div>
              <div className="stat-card"><p className="text-sm text-gray-500">Entries</p><p className="text-xl font-bold">{expenseData.summary.entries || 0}</p></div>
              <div className="stat-card"><p className="text-sm text-gray-500">Avg/Entry</p><p className="text-xl font-bold">₹{parseFloat(expenseData.summary.avg_expense || 0).toLocaleString()}</p></div>
            </div>
          )}
          <div className="card">
            <h3 className="font-semibold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={(expenseData.records || []).reduce((acc, r) => {
                  const existing = acc.find(a => a.category === r.category);
                  if (existing) existing.total += parseFloat(r.total);
                  else acc.push({ category: r.category, total: parseFloat(r.total) });
                  return acc;
                }, [])} cx="50%" cy="50%" outerRadius={100} dataKey="total" nameKey="category" label>
                  {(expenseData.records || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!milkData && !expenseData && !loading && (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>Select date range and click Generate</p>
        </div>
      )}
      {loading && <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" /></div>}
    </motion.div>
  );
}
