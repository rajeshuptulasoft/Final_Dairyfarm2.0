import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X, Search, Edit2, Trash2, DollarSign, User, Phone, Package, CreditCard } from 'lucide-react';
import { salesAPI } from '../services/api';
import toast from 'react-hot-toast';

const today = () => new Date().toISOString().split('T')[0];

const initForm = {
  sale_date: today(), customer_name: '', customer_phone: '', product: '',
  quantity: '', rate: '', amount: '', payment_method: 'cash', notes: '',
};

const FIELDS = [
  { key: 'sale_date', label: 'Date', type: 'date' },
  { key: 'customer_name', label: 'Customer', type: 'text' },
  { key: 'customer_phone', label: 'Phone', type: 'text' },
  { key: 'product', label: 'Product', type: 'text' },
  { key: 'quantity', label: 'Qty', type: 'text' },
  { key: 'rate', label: 'Rate(₹)', type: 'text' },
  { key: 'amount', label: 'Amount(₹)', type: 'text' },
  { key: 'payment_method', label: 'Payment', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'text' },
];

export default function Sales() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initForm);
  const [editForm, setEditForm] = useState(initForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const r = await salesAPI.list({ limit: 200 }); setRecords(r.data?.records || r.data?.sales || []); }
    catch { setRecords([]); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, quantity: parseFloat(form.quantity) || 0, rate: parseFloat(form.rate) || 0, amount: parseFloat(form.amount) || 0 };
      await salesAPI.create(data);
      toast.success('Sale added');
      setShowForm(false);
      setForm(initForm);
      await load();
    } catch { toast.error('Error saving'); }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...editForm, quantity: parseFloat(editForm.quantity) || 0, rate: parseFloat(editForm.rate) || 0, amount: parseFloat(editForm.amount) || 0 };
      await salesAPI.update(editId, data);
      toast.success('Sale updated');
      setShowEdit(false);
      setEditId(null);
      await load();
    } catch { toast.error('Error updating'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale?')) return;
    try { await salesAPI.delete(id); toast.success('Deleted'); await load(); }
    catch { toast.error('Error deleting'); }
  };

  const openEdit = (r) => {
    setEditForm({
      sale_date: r.sale_date || today(), customer_name: r.customer_name || '',
      customer_phone: r.customer_phone || '', product: r.product || '',
      quantity: r.quantity || '', rate: r.rate || '', amount: r.amount || '',
      payment_method: r.payment_method || 'cash', notes: r.notes || '',
    });
    setEditId(r.id);
    setShowEdit(true);
  };

  const autoCalcAmount = () => {
    const q = parseFloat(form.quantity) || 0;
    const r = parseFloat(form.rate) || 0;
    if (q && r) setForm(prev => ({ ...prev, amount: (q * r).toString() }));
  };

  const filtered = records.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return FIELDS.some(f => String(r[f.key] || '').toLowerCase().includes(q));
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,.12)', color: '#10b981' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Sales</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage sale records</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}><X size={14} /></button>}
        </div>
      </div>

      {/* New Sale Button */}
      <motion.button whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }} whileTap={{ scale: 0.96 }}
        onClick={() => { setForm(initForm); setShowForm(true); }}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none', borderRadius: 12, padding: '12px 22px',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontFamily: 'inherit',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
          <Plus size={16} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>New Sale</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Record a new sale</div>
        </div>
      </motion.button>

      {/* Premium Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1200px' }}>
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {FIELDS.map(f => (
                  <th key={f.key} className="text-left px-3 py-3 whitespace-nowrap">{f.label}</th>
                ))}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={FIELDS.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,.08)', color: '#10b981' }}>
                      <DollarSign size={28} />
                    </div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>{search ? 'No matches found' : 'No sales yet'}</p>
                    <p className="text-sm">Record your first sale using the button above</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id || i}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}>
                    {FIELDS.map(f => (
                      <td key={f.key} className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {f.key === 'customer_name' ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,.12)', color: '#10b981' }}>
                              <User size={16} />
                            </div>
                            <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{r.customer_name || '-'}</span>
                          </div>
                        ) : f.key === 'payment_method' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                            style={{
                              background: r.payment_method === 'cash' ? 'rgba(34,197,94,.1)' : r.payment_method === 'card' ? 'rgba(59,130,246,.1)' : 'rgba(168,85,247,.1)',
                              color: r.payment_method === 'cash' ? '#16a34a' : r.payment_method === 'card' ? '#2563eb' : '#9333ea',
                            }}>
                            <CreditCard size={12} />
                            {r.payment_method || 'cash'}
                          </span>
                        ) : f.key === 'amount' ? (
                          <span className="font-semibold" style={{ color: 'var(--text)' }}>₹{r.amount || '-'}</span>
                        ) : (r[f.key] || '-')}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: '#3b82f6' }}>
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: '#ef4444' }}>
                          <Trash2 size={15} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">New Sale Record</h2>
                <button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sale Date *</label>
                    <input type="date" className="input-field text-sm" value={form.sale_date} onChange={e => setForm({...form, sale_date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Customer Name *</label>
                    <input className="input-field text-sm" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} placeholder="Customer name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Customer Phone</label>
                    <input className="input-field text-sm" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product *</label>
                    <input className="input-field text-sm" value={form.product} onChange={e => setForm({...form, product: e.target.value})} placeholder="Product name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Quantity *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={form.quantity} onChange={e => { setForm({...form, quantity: e.target.value}); autoCalcAmount(); }} placeholder="Qty" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Rate (₹) *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={form.rate} onChange={e => { setForm({...form, rate: e.target.value}); autoCalcAmount(); }} placeholder="Rate" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Amount (₹) *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Auto-calculated" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Payment Method</label>
                    <select className="input-field text-sm" value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Notes</label>
                    <textarea className="input-field text-sm" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    Save
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <>
          <div className="modal-overlay" onClick={() => { setShowEdit(false); setEditId(null); }} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Edit Sale Record</h2>
                <button onClick={() => { setShowEdit(false); setEditId(null); }} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sale Date *</label>
                    <input type="date" className="input-field text-sm" value={editForm.sale_date} onChange={e => setEditForm({...editForm, sale_date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Customer Name *</label>
                    <input className="input-field text-sm" value={editForm.customer_name} onChange={e => setEditForm({...editForm, customer_name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Customer Phone</label>
                    <input className="input-field text-sm" value={editForm.customer_phone} onChange={e => setEditForm({...editForm, customer_phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product *</label>
                    <input className="input-field text-sm" value={editForm.product} onChange={e => setEditForm({...editForm, product: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Quantity *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Rate (₹) *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={editForm.rate} onChange={e => setEditForm({...editForm, rate: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Amount (₹) *</label>
                    <input type="number" step="0.01" className="input-field text-sm" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Payment Method</label>
                    <select className="input-field text-sm" value={editForm.payment_method} onChange={e => setEditForm({...editForm, payment_method: e.target.value})}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Notes</label>
                    <textarea className="input-field text-sm" rows={3} value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    Save Changes
                  </button>
                  <button type="button" onClick={() => { setShowEdit(false); setEditId(null); }} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
