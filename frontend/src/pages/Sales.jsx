import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X, Search, Edit2, Trash2, DollarSign, User, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import ModalPortal from '../components/ui/ModalPortal';
import { salesAPI } from '../services/api';
import SalesFormFields from '../components/sales/SalesFormFields';
import { getInitialSaleForm, buildSalePayload, saleFromRecord } from '../utils/saleForm';

const TABLE_FIELDS = [
  { key: 'sale_date', label: 'Date' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'customer_phone', label: 'Phone' },
  { key: 'item_name', label: 'Item' },
  { key: 'quantity', label: 'Qty' },
  { key: 'rate', label: 'Rate(₹)' },
  { key: 'amount', label: 'Amount(₹)' },
  { key: 'payment_method', label: 'Payment' },
  { key: 'notes', label: 'Notes' },
];

export default function Sales() {
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(getInitialSaleForm);
  const [editForm, setEditForm] = useState(getInitialSaleForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await salesAPI.products();
      setProducts(res.data?.products || []);
    } catch {
      setProducts([]);
    }
  };

  const load = async () => {
    try {
      const res = await salesAPI.list({ limit: 200 });
      setRecords(res.data?.records || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error loading sales');
    }
  };

  useEffect(() => {
    load();
    loadProducts();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialSaleForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialSaleForm());
  };

  const saleErrorMessage = (err) => {
    const stock = err.response?.data?.available_stock;
    const unit = err.response?.data?.unit;
    if (stock != null) {
      return `${err.response?.data?.error || 'Insufficient stock'} (available: ${stock}${unit ? ` ${unit}` : ''})`;
    }
    return (
      err.response?.data?.error ||
      (Array.isArray(err.response?.data?.errors)
        ? err.response.data.errors.join(', ')
        : err.response?.data?.errors) ||
      'Error saving sale'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await salesAPI.create(buildSalePayload(form));
      const created = res.data?.record;
      if (created?.id) {
        setRecords((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      }
      toast.success(res.data?.message || 'Sale registered');
      closeAdd();
      await load();
      await loadProducts();
    } catch (err) {
      toast.error(saleErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await salesAPI.update(editId, buildSalePayload(editForm));
      toast.success(res.data?.message || 'Sale updated');
      closeEdit();
      await load();
      await loadProducts();
    } catch (err) {
      toast.error(saleErrorMessage(err));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale?')) return;
    try {
      await salesAPI.delete(id);
      toast.success('Deleted');
      await load();
      await loadProducts();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(saleFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return TABLE_FIELDS.some((f) => String(r[f.key] || '').toLowerCase().includes(q));
  });

  const renderModal = (title, formState, setFormState, onSubmit, onClose, submitLabel) => (
    <ModalPortal>
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
              <SalesFormFields form={formState} setForm={setFormState} products={products} />
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
    </ModalPortal>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,.12)', color: '#10b981' }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Sales
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage sale records
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
          setForm(getInitialSaleForm());
          setShowForm(true);
        }}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>New Sale</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Record a new sale</div>
        </div>
      </motion.button>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1200px' }}>
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {TABLE_FIELDS.map((f) => (
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
                  <td colSpan={TABLE_FIELDS.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,.08)', color: '#10b981' }}
                      >
                        <DollarSign size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No sales yet'}
                      </p>
                      <p className="text-sm">Record your first sale using the button above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {TABLE_FIELDS.map((f) => (
                      <td
                        key={f.key}
                        className="px-3 py-3 text-sm whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {f.key === 'customer_name' ? (
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(16,185,129,.12)', color: '#10b981' }}
                            >
                              <User size={16} />
                            </div>
                            <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                              {r.customer_name || '—'}
                            </span>
                          </div>
                        ) : f.key === 'payment_method' ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background:
                                String(r.payment_method).toLowerCase() === 'cash'
                                  ? 'rgba(34,197,94,.1)'
                                  : String(r.payment_method).toLowerCase() === 'card'
                                    ? 'rgba(59,130,246,.1)'
                                    : 'rgba(168,85,247,.1)',
                              color:
                                String(r.payment_method).toLowerCase() === 'cash'
                                  ? '#16a34a'
                                  : String(r.payment_method).toLowerCase() === 'card'
                                    ? '#2563eb'
                                    : '#9333ea',
                            }}
                          >
                            <CreditCard size={12} />
                            {r.payment_method || 'Cash'}
                          </span>
                        ) : f.key === 'amount' ? (
                          <span className="font-semibold" style={{ color: 'var(--text)' }}>
                            ₹{r.amount ?? '—'}
                          </span>
                        ) : f.key === 'quantity' ? (
                          <span>
                            {r.quantity ?? '—'} {r.unit || 'kg'}
                          </span>
                        ) : (
                          r[f.key] ?? '—'
                        )}
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
        </div>
      </div>

      {showForm && renderModal('Register Sale', form, setForm, handleSubmit, closeAdd, 'Register')}
      {showEdit && renderModal('Edit Sale', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
