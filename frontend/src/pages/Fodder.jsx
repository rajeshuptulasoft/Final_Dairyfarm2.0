import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Search, Edit2, Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const initForm = {
  base_fodder_item: 'chokada', exchange_fodder_item: 'chokada',
  base_fodder_qty: '', exchange_fodder_qty: '', unit: 'Kg', exchange_unit: 'Kg',
};

export default function Fodder() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initForm);
  const [editForm, setEditForm] = useState(initForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); const rec = { id: Date.now(), ...form }; setRecords(prev => [rec, ...prev]);
    setShowForm(false); setForm(initForm); toast.success('Fodder exchange added');
  };
  const handleUpdate = (e) => {
    e.preventDefault(); setRecords(prev => prev.map(r => r.id === editId ? { ...r, ...editForm } : r));
    setShowEdit(false); setEditId(null); toast.success('Fodder updated');
  };
  const handleDelete = (id) => {
    if (!confirm('Delete this fodder exchange?')) return; setRecords(prev => prev.filter(r => r.id !== id)); toast.success('Deleted');
  };
  const openEdit = (r) => {
    setEditForm({
      base_fodder_item: r.base_fodder_item || 'chokada', exchange_fodder_item: r.exchange_fodder_item || 'chokada',
      base_fodder_qty: r.base_fodder_qty || '', exchange_fodder_qty: r.exchange_fodder_qty || '',
      unit: r.unit || 'Kg', exchange_unit: r.exchange_unit || 'Kg',
    }); setEditId(r.id); setShowEdit(true);
  };
  const filtered = records.filter(r => { if (!search) return true; const q = search.toLowerCase(); return Object.values(r).some(v => String(v).toLowerCase().includes(q)); });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,.12)', color: '#8b5cf6' }}><Layers size={22} /></div>
          <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Fodder</h1><p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage fodder exchange rates</p></div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}><X size={14} /></button>}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                <th className="text-left px-3 py-3">Base Item</th>
                <th className="text-left px-3 py-3">Base Qty</th>
                <th className="text-left px-3 py-3">Exchange Item</th>
                <th className="text-left px-3 py-3">Exchange Qty</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,.08)', color: '#8b5cf6' }}><Layers size={28} /></div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>{search ? 'No matches' : 'No fodder exchanges yet'}</p></div></td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id || i} className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>{r.base_fodder_item || '-'}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.base_fodder_qty ? `${r.base_fodder_qty} ${r.unit || ''}` : '-'}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.exchange_fodder_item || '-'}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.exchange_fodder_qty ? `${r.exchange_fodder_qty} ${r.exchange_unit || ''}` : '-'}</td>
                  <td className="px-3 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: '#3b82f6' }}><Edit2 size={15} /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: '#ef4444' }}><Trash2 size={15} /></motion.button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <><div className="modal-overlay" onClick={() => setShowForm(false)} /><div className="modal-container"><div className="modal-content"><div className="modal-header"><h2 className="modal-title">New Fodder Exchange</h2><button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button></div>
        <form onSubmit={handleSubmit}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Fodder Item</label><select className="input-field text-sm" value={form.base_fodder_item} onChange={e => setForm({...form, base_fodder_item: e.target.value})}><option value="chokada">chokada</option><option value="grass">grass</option><option value="hay">hay</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Fodder Item</label><select className="input-field text-sm" value={form.exchange_fodder_item} onChange={e => setForm({...form, exchange_fodder_item: e.target.value})}><option value="chokada">chokada</option><option value="grass">grass</option><option value="hay">hay</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Qty *</label><input className="input-field text-sm" value={form.base_fodder_qty} onChange={e => setForm({...form, base_fodder_qty: e.target.value})} placeholder="Qty" required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Unit</label><select className="input-field text-sm" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}><option value="Kg">Kg</option><option value="L">L</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Qty *</label><input className="input-field text-sm" value={form.exchange_fodder_qty} onChange={e => setForm({...form, exchange_fodder_qty: e.target.value})} placeholder="Qty" required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Unit</label><select className="input-field text-sm" value={form.exchange_unit} onChange={e => setForm({...form, exchange_unit: e.target.value})}><option value="Kg">Kg</option><option value="L">L</option></select></div>
        </div><div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}><button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button></div></form></div></div></>
      )}
      {showEdit && (
        <><div className="modal-overlay" onClick={() => { setShowEdit(false); setEditId(null); }} /><div className="modal-container"><div className="modal-content"><div className="modal-header"><h2 className="modal-title">Edit Fodder Exchange</h2><button onClick={() => { setShowEdit(false); setEditId(null); }} className="modal-close-btn"><X size={28} /></button></div>
        <form onSubmit={handleUpdate}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Fodder Item</label><select className="input-field text-sm" value={editForm.base_fodder_item} onChange={e => setEditForm({...editForm, base_fodder_item: e.target.value})}><option value="chokada">chokada</option><option value="grass">grass</option><option value="hay">hay</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Fodder Item</label><select className="input-field text-sm" value={editForm.exchange_fodder_item} onChange={e => setEditForm({...editForm, exchange_fodder_item: e.target.value})}><option value="chokada">chokada</option><option value="grass">grass</option><option value="hay">hay</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Qty *</label><input className="input-field text-sm" value={editForm.base_fodder_qty} onChange={e => setEditForm({...editForm, base_fodder_qty: e.target.value})} required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Base Unit</label><select className="input-field text-sm" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}><option value="Kg">Kg</option><option value="L">L</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Qty *</label><input className="input-field text-sm" value={editForm.exchange_fodder_qty} onChange={e => setEditForm({...editForm, exchange_fodder_qty: e.target.value})} required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Exchange Unit</label><select className="input-field text-sm" value={editForm.exchange_unit} onChange={e => setEditForm({...editForm, exchange_unit: e.target.value})}><option value="Kg">Kg</option><option value="L">L</option></select></div>
        </div><div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}><button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Changes</button><button type="button" onClick={() => { setShowEdit(false); setEditId(null); }} className="btn-secondary">Cancel</button></div></form></div></div></>
      )}
    </motion.div>
  );
}
