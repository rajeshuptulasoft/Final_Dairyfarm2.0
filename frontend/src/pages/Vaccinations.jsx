import { useState, useEffect } from 'react';
import { purchaseAPI, itemsAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Save, X, Search, Edit2, Trash2, Package, ShoppingCart, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import PurchaseFormFields from '../components/purchase/PurchaseFormFields';
import { getInitialPurchaseForm, buildPurchasePayload, purchaseFromRecord } from '../utils/purchaseForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

const FIELDS = [
  { key: 'purchase_date', label: 'Date' },
  { key: 'bill_code', label: 'Bill Code' },
  { key: 'item_name', label: 'Item' },
  { key: 'item_type', label: 'Type' },
  { key: 'quantity', label: 'Qty' },
  { key: 'unit', label: 'Unit' },
  { key: 'rate', label: 'Rate (₹)' },
  { key: 'total_amount', label: 'Total (₹)' },
  { key: 'paid', label: 'Paid' },
  { key: 'remarks', label: 'Remarks' },
];

export default function Vaccinations() {
  const [records, setRecords] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(getInitialPurchaseForm);
  const [editForm, setEditForm] = useState(getInitialPurchaseForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [p, i] = await Promise.all([
        purchaseAPI.list({ limit: 200 }),
        itemsAPI.list({ limit: 200 }),
      ]);
      setRecords(p.data?.records || []);
      setItems(i.data?.records || []);
    } catch {
      setRecords([]);
      toast.error('Error loading purchase records');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialPurchaseForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialPurchaseForm());
  };

  const purchaseErrorMessage = (err) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    'Error saving purchase';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await purchaseAPI.create(buildPurchasePayload(form));
      toast.success(res.data?.message || 'Purchase recorded');
      closeAdd();
      await load();
    } catch (err) {
      toast.error(purchaseErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await purchaseAPI.update(editId, buildPurchasePayload(editForm));
      toast.success(res.data?.message || 'Purchase updated');
      closeEdit();
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating purchase');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this purchase?')) return;
    try {
      await purchaseAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(purchaseFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      r.purchase_date,
      r.bill_code,
      r.item_name,
      r.item_type,
      r.quantity,
      r.unit,
      r.rate,
      r.total_amount,
      r.paid,
      r.remarks,
    ].some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  const renderCell = (r, f) => {
    if (f.key === 'item_name') {
      return (
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,.12)', color: '#a855f7' }}
          >
            <Package size={16} />
          </div>
          <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
            {r.item_name || '-'}
          </span>
        </div>
      );
    }
    if (f.key === 'item_type') {
      const type = r.item_type || 'Fodder';
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: type === 'Fodder' ? 'rgba(34,197,94,.1)' : 'rgba(59,130,246,.1)',
            color: type === 'Fodder' ? '#16a34a' : '#2563eb',
          }}
        >
          {type}
        </span>
      );
    }
    if (f.key === 'rate' || f.key === 'total_amount') {
      return (
        <span className="font-semibold" style={{ color: 'var(--text)' }}>
          ₹{r[f.key] ?? '-'}
        </span>
      );
    }
    if (f.key === 'paid') {
      const isPaid = r.paid === 'Yes' || r.paid === 'yes';
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
          style={{
            background: isPaid ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
            color: isPaid ? '#16a34a' : '#dc2626',
          }}
        >
          <CreditCard size={12} />
          {r.paid || '-'}
        </span>
      );
    }
    return r[f.key] ?? '-';
  };

  const renderModal = (title, formState, setFormState, onSubmit, onClose, submitLabel) => (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
              <X size={28} />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <PurchaseFormFields form={formState} setForm={setFormState} items={items} />
            <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? 'Saving...' : submitLabel}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,.12)', color: '#a855f7' }}
          >
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Purchase
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Track purchases and buy entries
            </p>
          </div>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-soft)' }}
          />
          <input
            className="input-field pl-9"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-soft)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setForm(getInitialPurchaseForm());
          setShowForm(true);
        }}
        style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
          border: 'none',
          borderRadius: 12,
          padding: '12px 22px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.2)',
          }}
        >
          <Plus size={16} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Buy Now</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Record a new purchase</div>
        </div>
      </motion.button>

      <AdminTablePanel noPadding>
          <table className="w-full admin-data-table">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {FIELDS.map((f) => (
                  <th key={f.key} className="text-left px-3 py-3 whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={FIELDS.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(168,85,247,.08)', color: '#a855f7' }}
                      >
                        <Package size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No purchases yet'}
                      </p>
                      <p className="text-sm">Record your first purchase using Buy Now</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id || i}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {FIELDS.map((f) => (
                      <td
                        key={f.key}
                        className="px-3 py-3 text-sm whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {renderCell(r, f)}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          style={{ color: '#3b82f6' }}
                        >
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={15} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </AdminTablePanel>

      {showForm && renderModal('New Purchase Record', form, setForm, handleSubmit, closeAdd, 'Register')}
      {showEdit && renderModal('Edit Purchase Record', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
