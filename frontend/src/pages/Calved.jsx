import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { animalsAPI, calvedAPI } from '../services/api';
import { Plus, Save, X, Search, Edit2, Trash2, Book, Beef } from 'lucide-react';
import toast from 'react-hot-toast';
import CalvedFormFields from '../components/calved/CalvedFormFields';
import { getInitialCalvedForm, buildCalvedPayload, calvedFromRecord } from '../utils/calvedForm';

const TABLE_COLUMNS = [
  { key: 'calving_date', label: 'Calving Date' },
  { key: 'animal_name', label: 'Animal' },
  { key: 'calf_count', label: 'Calves' },
  { key: 'veterinarian', label: 'Veterinarian' },
  { key: 'remarks', label: 'Remarks' },
];

export default function Calved() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState(getInitialCalvedForm);
  const [editForm, setEditForm] = useState(getInitialCalvedForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const [r, a] = await Promise.all([
        calvedAPI.list({ limit: 200 }),
        animalsAPI.list({ limit: 200 }),
      ]);
      setRecords(r.data?.records || []);
      setAnimals(a.data?.animals || []);
    } catch {
      toast.error('Error loading calving records');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialCalvedForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialCalvedForm());
  };

  const calvedErrorMessage = (err) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    'Error saving calving record';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildCalvedPayload(form);
      const res = await calvedAPI.create(payload);
      toast.success(res.data?.message || 'Calving record added');
      closeAdd();
      await load();
    } catch (err) {
      toast.error(calvedErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildCalvedPayload(editForm);
      const res = await calvedAPI.update(editId, payload);
      toast.success(res.data?.message || 'Calving record updated');
      closeEdit();
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating calving record');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await calvedAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(calvedFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      r.tag_number,
      r.animal_name,
      r.calving_date,
      r.veterinarian,
      r.remarks,
      r.calf_count,
    ].some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  const renderModal = (title, formState, setFormState, onSubmit, onClose, submitLabel) => (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-content" style={{ maxWidth: '900px' }}>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
              <X size={28} />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <CalvedFormFields form={formState} setForm={setFormState} animals={animals} />
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
            style={{ background: 'rgba(245,158,11,.12)', color: '#d97706' }}
          >
            <Book size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Calved
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Comprehensive calving records with health, breeding, and pregnancy history
            </p>
          </div>
        </div>
        <div className="relative min-w-[200px]">
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
          setForm(getInitialCalvedForm());
          setShowForm(true);
        }}
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
          <div style={{ fontSize: 14, fontWeight: 600 }}>New Calving Record</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Register full calving details</div>
        </div>
      </motion.button>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {TABLE_COLUMNS.map((col) => (
                  <th key={col.key} className="text-left px-3 py-3 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(245,158,11,.08)', color: '#d97706' }}
                      >
                        <Book size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No records yet'}
                      </p>
                      <p className="text-sm">Add a calving record using the button above</p>
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
                    {TABLE_COLUMNS.map((col) => {
                      if (col.key === 'animal_name') {
                        return (
                          <td key={col.key} className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(245,158,11,.12)', color: '#d97706' }}
                              >
                                <Beef size={16} />
                              </div>
                              <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                                {r.animal_name || `#${r.tag_number || '-'}`}
                              </span>
                            </div>
                          </td>
                        );
                      }
                      const val = col.key === 'veterinarian' ? r.veterinarian : r[col.key];
                      return (
                        <td
                          key={col.key}
                          className="px-3 py-3 text-sm whitespace-nowrap"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {val ?? '-'}
                        </td>
                      );
                    })}
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

      {showForm && renderModal('New Calving Record', form, setForm, handleSubmit, closeAdd, 'Register')}
      {showEdit && renderModal('Edit Calving Record', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
