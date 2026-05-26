import { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Feed', 'Vaccination', 'Veterinary', 'Labour', 'Equipment', 'Utilities', 'Transport', 'Other'];

export default function Expenses() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ from: '', to: '', category: '' });
  const [form, setForm] = useState({ category: '', amount: '', expense_date: new Date().toISOString().split('T')[0], description: '', payment_method: 'cash' });

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        expensesAPI.list({ from: filter.from, to: filter.to, category: filter.category }),
        expensesAPI.summary({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
      ]);
      setRecords(r.data.records || []);
      setSummary(s.data);
    } catch {}
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expensesAPI.create({ ...form, amount: parseFloat(form.amount) });
      toast.success('Expense recorded');
      setShowForm(false);
      setForm({ category: '', amount: '', expense_date: new Date().toISOString().split('T')[0], description: '', payment_method: 'cash' });
      load();
    } catch { toast.error('Error saving'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track farm expenses</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Expense</button>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card"><p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p><p className="text-xl font-bold text-red-600">₹{summary.totalExpenses?.toLocaleString() || 0}</p></div>
          <div className="stat-card"><p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p><p className="text-xl font-bold text-green-600">₹{summary.totalRevenue?.toLocaleString() || 0}</p></div>
          <div className="stat-card"><p className="text-sm text-gray-500 dark:text-gray-400">Profit</p><p className={`text-xl font-bold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{summary.profit?.toLocaleString() || 0}</p></div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input type="date" className="input-field w-auto" value={filter.from} onChange={e => setFilter(f => ({...f, from: e.target.value}))} />
        <input type="date" className="input-field w-auto" value={filter.to} onChange={e => setFilter(f => ({...f, to: e.target.value}))} />
        <select className="input-field w-auto" value={filter.category} onChange={e => setFilter(f => ({...f, category: e.target.value}))}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">No expenses</td></tr>
            ) : records.map(r => (
              <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.expense_date}</td>
                <td className="px-4 py-3"><span className="badge-info">{r.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{r.description || '-'}</td>
                <td className="px-4 py-3 text-sm capitalize">{r.payment_method || '-'}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold">₹{parseFloat(r.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)} />
          <div className="modal-container">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Expense</h2>
                <button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Category *</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1">Amount (₹) *</label>
                  <input type="number" step="0.01" className="input-field" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="input-field" value={form.expense_date} onChange={e => setForm({...form, expense_date: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select className="input-field" value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}>
                    <option value="cash">Cash</option><option value="card">Card</option><option value="bank">Bank Transfer</option><option value="upi">UPI</option>
                  </select></div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
