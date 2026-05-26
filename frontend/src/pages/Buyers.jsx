import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X, Search, Edit2, Trash2, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';
import ModalPortal from '../components/ui/ModalPortal';
import { buyersAPI } from '../services/api';
import BuyerFormFields from '../components/buyers/BuyerFormFields';
import { getInitialBuyerForm, buildBuyerPayload, buyerFromRecord } from '../utils/buyerForm';

export default function Buyers() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(getInitialBuyerForm);
  const [editForm, setEditForm] = useState(getInitialBuyerForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const parseBuyerList = (data) => {
    if (Array.isArray(data?.records)) return data.records;
    if (Array.isArray(data?.buyers)) return data.buyers;
    if (Array.isArray(data)) return data;
    return null;
  };

  const load = async () => {
    try {
      const res = await buyersAPI.list({ limit: 200 });
      const list = parseBuyerList(res.data);
      if (list) setRecords(list);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error loading buyers');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialBuyerForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialBuyerForm());
  };

  const buyerErrorMessage = (err) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    'Error saving buyer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await buyersAPI.create(buildBuyerPayload(form));
      const created = res.data?.record;
      if (created?.id) {
        setRecords((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      }
      toast.success(res.data?.message || 'Buyer added');
      closeAdd();
      await load();
    } catch (err) {
      toast.error(buyerErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildBuyerPayload(editForm);
      const res = await buyersAPI.update(editId, payload);
      setRecords((prev) =>
        prev.map((r) => (r.id === editId ? { ...r, ...payload, id: editId } : r))
      );
      toast.success(res.data?.message || 'Buyer updated');
      closeEdit();
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating buyer');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await buyersAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(buyerFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  const isOrgYes = (v) => v === 'Yes' || v === 'yes';

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
              <BuyerFormFields form={formState} setForm={setFormState} />
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
            style={{ background: 'rgba(236,72,153,.12)', color: '#ec4899' }}
          >
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Buyers
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage buyer contacts
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
          setForm(getInitialBuyerForm());
          setShowForm(true);
        }}
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
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
          <div style={{ fontSize: 14, fontWeight: 600 }}>Add Buyer</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Register a new buyer</div>
        </div>
      </motion.button>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1000px' }}>
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                <th className="text-left px-3 py-3">Buyer</th>
                <th className="text-left px-3 py-3">Contact</th>
                <th className="text-left px-3 py-3">Phone</th>
                <th className="text-left px-3 py-3">GST</th>
                <th className="text-left px-3 py-3">Org</th>
                <th className="text-left px-3 py-3">Max Credit</th>
                <th className="text-left px-3 py-3">To Pay</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(236,72,153,.08)', color: '#ec4899' }}
                      >
                        <Users size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches' : 'No buyers yet'}
                      </p>
                      <p className="text-sm">Add your first buyer using the button above</p>
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
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(236,72,153,.12)', color: '#ec4899' }}
                        >
                          <User size={16} />
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                          {r.buyer_name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.contact_person || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.contact_no || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.gst_no || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: isOrgYes(r.is_organization)
                            ? 'rgba(34,197,94,.1)'
                            : 'rgba(239,68,68,.1)',
                          color: isOrgYes(r.is_organization) ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {r.is_organization || 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      ₹{r.max_credit ?? '0'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      ₹{r.buyer_to_pay ?? '0'}
                    </td>
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

      {showForm && renderModal('New Buyer', form, setForm, handleSubmit, closeAdd, 'Register')}
      {showEdit && renderModal('Edit Buyer', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
