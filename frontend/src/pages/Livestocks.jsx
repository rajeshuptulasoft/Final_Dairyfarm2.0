import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X, Search, Edit2, Trash2, Activity, Beef } from 'lucide-react';
import toast from 'react-hot-toast';
import ModalPortal from '../components/ui/ModalPortal';
import { livestockAPI, itemsAPI } from '../services/api';
import LivestockFormFields from '../components/livestock/LivestockFormFields';
import {
  getInitialLivestockForm,
  buildLivestockPayload,
  livestockFromRecord,
} from '../utils/livestockForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

export default function Livestocks() {
  const [records, setRecords] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(getInitialLivestockForm);
  const [editForm, setEditForm] = useState(getInitialLivestockForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [l, i] = await Promise.all([
        livestockAPI.list({ limit: 200 }),
        itemsAPI.list({ limit: 200 }),
      ]);
      setRecords(l.data?.records || []);
      setItems(i.data?.records || []);
    } catch {
      setRecords([]);
      toast.error('Error loading livestock records');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialLivestockForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialLivestockForm());
  };

  const livestockErrorMessage = (err) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    'Error saving livestock';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await livestockAPI.create(buildLivestockPayload(form, items));
      toast.success(res.data?.message || 'Livestock added');
      closeAdd();
      await load();
    } catch (err) {
      toast.error(livestockErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await livestockAPI.update(editId, buildLivestockPayload(editForm, items));
      toast.success(res.data?.message || 'Livestock updated');
      closeEdit();
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating livestock');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this livestock?')) return;
    try {
      await livestockAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(livestockFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  const feedLabel = (qty, unit) => (qty != null && qty !== '' ? `${qty} ${unit || ''}` : '-');

  const renderModal = (title, formState, setFormState, onSubmit, onClose, submitLabel) => (
    <ModalPortal>
      <>
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-container">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <LivestockFormFields form={formState} setForm={setFormState} items={items} />
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
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Livestocks
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage livestock categories
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-md">
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

      {/* <motion.button
        whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setForm(getInitialLivestockForm());
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
          <div style={{ fontSize: 14, fontWeight: 600 }}>Add Livestock</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Register a new livestock category</div>
        </div>
      </motion.button> */}

      <AdminTablePanel noPadding>
          <table className="w-full admin-data-table">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                <th className="text-left px-3 py-3">Group</th>
                <th className="text-left px-3 py-3">Type</th>
                <th className="text-left px-3 py-3">Breed</th>
                <th className="text-left px-3 py-3">Fodder</th>
                <th className="text-left px-3 py-3">Milking</th>
                <th className="text-left px-3 py-3">Delivers</th>
                <th className="text-left px-3 py-3">Preg Dur</th>
                <th className="text-left px-3 py-3">Feed Count</th>
                <th className="text-left px-3 py-3">Normal Feed</th>
                <th className="text-left px-3 py-3">Preg Feed</th>
                <th className="text-left px-3 py-3">Calf Feed</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,.08)', color: '#10b981' }}
                      >
                        <Beef size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No livestocks yet'}
                      </p>
                      <p className="text-sm">Add your first livestock using the button above</p>
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
                    <td className="px-3 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {r.group_name || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background:
                            (r.livestock_type || 'Animal') === 'Animal'
                              ? 'rgba(34,197,94,.1)'
                              : 'rgba(59,130,246,.1)',
                          color:
                            (r.livestock_type || 'Animal') === 'Animal' ? '#16a34a' : '#2563eb',
                        }}
                      >
                        {r.livestock_type || 'Animal'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.breed || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.base_fodder_name || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background:
                            (r.milking || 'Yes') === 'Yes'
                              ? 'rgba(34,197,94,.1)'
                              : 'rgba(239,68,68,.1)',
                          color: (r.milking || 'Yes') === 'Yes' ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {r.milking || 'Yes'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.delivers || '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.pregnancy_duration
                        ? `${r.pregnancy_duration} ${r.pregnancy_span || ''}`
                        : '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.daily_feed_count ?? '-'}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {feedLabel(r.daily_normal_feed_qty, r.daily_normal_feed_unit)}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {feedLabel(r.daily_pregnant_feed_qty, r.daily_pregnant_feed_unit)}
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {feedLabel(r.daily_calf_feed_qty, r.daily_calf_feed_unit)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          style={{ color: 'var(--text-soft)' }}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                          style={{ color: 'var(--text-soft)' }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </AdminTablePanel>

      {showForm && renderModal('New Livestock Entry', form, setForm, handleSubmit, closeAdd, 'Register')}
      {showEdit &&
        renderModal('Edit Livestock Entry', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
