import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Search, Edit2, Trash2, Package2, Box, Activity, Layers, Users, Truck, HeartPulse, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const settingSections = [
  { key: 'items', path: '/muktifarm/admin/settings/items', label: 'Items', icon: Box, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  { key: 'livestocks', path: '/muktifarm/admin/settings/livestocks', label: 'Livestocks', icon: Activity, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { key: 'products', path: '/muktifarm/admin/settings/products', label: 'Products', icon: Package2, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { key: 'fodder', path: '/muktifarm/admin/settings/fodder', label: 'Fodder', icon: Layers, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  { key: 'buyers', path: '/muktifarm/admin/settings/buyers', label: 'Buyers', icon: Users, gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
  { key: 'vendors', path: '/muktifarm/admin/settings/vendors', label: 'Vendors', icon: Truck, gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  { key: 'doctors', path: '/muktifarm/admin/settings/doctors', label: 'Doctors', icon: HeartPulse, gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
];

const initForm = {
  product_name: '', sku_unit: 'bottle', mrp: '', category: 'Cheese',
  sub_category: 'default', product_life: '', product_life_unit: 'Minutes', remarks: '',
};

export default function Products() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initForm);
  const [editForm, setEditForm] = useState(initForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); const rec = { id: Date.now(), ...form }; setRecords(prev => [rec, ...prev]);
    setShowForm(false); setForm(initForm); toast.success('Product added');
  };
  const handleUpdate = (e) => {
    e.preventDefault(); setRecords(prev => prev.map(r => r.id === editId ? { ...r, ...editForm } : r));
    setShowEdit(false); setEditId(null); toast.success('Product updated');
  };
  const handleDelete = (id) => {
    if (!confirm('Delete this product?')) return; setRecords(prev => prev.filter(r => r.id !== id)); toast.success('Deleted');
  };
  const openEdit = (r) => {
    setEditForm({
      product_name: r.product_name || '', sku_unit: r.sku_unit || 'bottle', mrp: r.mrp || '',
      category: r.category || 'Cheese', sub_category: r.sub_category || 'default',
      product_life: r.product_life || '', product_life_unit: r.product_life_unit || 'Minutes', remarks: r.remarks || '',
    }); setEditId(r.id); setShowEdit(true);
  };
  const filtered = records.filter(r => { if (!search) return true; const q = search.toLowerCase(); return Object.values(r).some(v => String(v).toLowerCase().includes(q)); });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}><Package2 size={22} /></div>
          <div><h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Products</h1><p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage products</p></div>
        </div>
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}><X size={14} /></button>}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1000px' }}>
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                <th className="text-left px-3 py-3">Product</th>
                <th className="text-left px-3 py-3">SKU</th>
                <th className="text-left px-3 py-3">MRP</th>
                <th className="text-left px-3 py-3">Category</th>
                <th className="text-left px-3 py-3">Sub Category</th>
                <th className="text-left px-3 py-3">Life</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,.08)', color: '#f59e0b' }}><Package2 size={28} /></div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>{search ? 'No matches' : 'No products yet'}</p></div></td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id || i} className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}><Tag size={16} /></div><span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{r.product_name || '-'}</span></div></td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.sku_unit || '-'}</td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: 'var(--text)' }}>₹{r.mrp || '-'}</td>
                  <td className="px-3 py-3 text-sm"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(245,158,11,.1)', color: '#d97706' }}>{r.category || '-'}</span></td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.sub_category || '-'}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{r.product_life ? `${r.product_life} ${r.product_life_unit || ''}` : '-'}</td>
                  <td className="px-3 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: '#3b82f6' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: '#ef4444' }}><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* New Modal */}
      {showForm && (
        <><div className="modal-overlay" onClick={() => setShowForm(false)} /><div className="modal-container"><div className="modal-content"><div className="modal-header"><h2 className="modal-title">New Product</h2><button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button></div>
        <form onSubmit={handleSubmit}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product Name *</label><input className="input-field text-sm" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} placeholder="Product name" required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>SKU Unit</label><select className="input-field text-sm" value={form.sku_unit} onChange={e => setForm({...form, sku_unit: e.target.value})}><option value="bottle">bottle</option><option value="ltr">ltr</option><option value="pack">pack</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>MRP (₹)</label><input className="input-field text-sm" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})} placeholder="MRP" /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Category</label><select className="input-field text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="Cheese">Cheese</option><option value="Milk">Milk</option><option value="Yogurt">Yogurt</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sub Category</label><select className="input-field text-sm" value={form.sub_category} onChange={e => setForm({...form, sub_category: e.target.value})}><option value="default">default</option><option value="milk">milk</option><option value="cheese">cheese</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product Life</label><input className="input-field text-sm" value={form.product_life} onChange={e => setForm({...form, product_life: e.target.value})} placeholder="Life" /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Life Unit</label><select className="input-field text-sm" value={form.product_life_unit} onChange={e => setForm({...form, product_life_unit: e.target.value})}><option value="Minutes">Minutes</option><option value="Hours">Hours</option><option value="Days">Days</option></select></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Remarks</label><textarea className="input-field text-sm" rows={3} value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="Remarks" /></div>
        </div><div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}><button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button></div></form></div></div></>
      )}
      {/* Edit Modal */}
      {showEdit && (
        <><div className="modal-overlay" onClick={() => { setShowEdit(false); setEditId(null); }} /><div className="modal-container"><div className="modal-content"><div className="modal-header"><h2 className="modal-title">Edit Product</h2><button onClick={() => { setShowEdit(false); setEditId(null); }} className="modal-close-btn"><X size={28} /></button></div>
        <form onSubmit={handleUpdate}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product Name *</label><input className="input-field text-sm" value={editForm.product_name} onChange={e => setEditForm({...editForm, product_name: e.target.value})} required /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>SKU Unit</label><select className="input-field text-sm" value={editForm.sku_unit} onChange={e => setEditForm({...editForm, sku_unit: e.target.value})}><option value="bottle">bottle</option><option value="ltr">ltr</option><option value="pack">pack</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>MRP (₹)</label><input className="input-field text-sm" value={editForm.mrp} onChange={e => setEditForm({...editForm, mrp: e.target.value})} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Category</label><select className="input-field text-sm" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}><option value="Cheese">Cheese</option><option value="Milk">Milk</option><option value="Yogurt">Yogurt</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sub Category</label><select className="input-field text-sm" value={editForm.sub_category} onChange={e => setEditForm({...editForm, sub_category: e.target.value})}><option value="default">default</option><option value="milk">milk</option><option value="cheese">cheese</option></select></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Product Life</label><input className="input-field text-sm" value={editForm.product_life} onChange={e => setEditForm({...editForm, product_life: e.target.value})} /></div>
          <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Life Unit</label><select className="input-field text-sm" value={editForm.product_life_unit} onChange={e => setEditForm({...editForm, product_life_unit: e.target.value})}><option value="Minutes">Minutes</option><option value="Hours">Hours</option><option value="Days">Days</option></select></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Remarks</label><textarea className="input-field text-sm" rows={3} value={editForm.remarks} onChange={e => setEditForm({...editForm, remarks: e.target.value})} /></div>
        </div><div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}><button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Changes</button><button type="button" onClick={() => { setShowEdit(false); setEditId(null); }} className="btn-secondary">Cancel</button></div></form></div></div></>
      )}
    </motion.div>
  );
}
