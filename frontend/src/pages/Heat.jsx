import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { heatAPI, animalsAPI } from '../services/api';
import { Thermometer, Plus, Save, X, Search, Edit2, Trash2, Beef } from 'lucide-react';
import toast from 'react-hot-toast';
import HeatFormFields from '../components/animals/HeatFormFields';
import { getInitialHeatForm, buildHeatPayload, heatFromRecord } from '../utils/heatForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

const TABLE_COLUMNS = [
  { key: 'tag', label: 'Animal Tag' },
  { key: 'breed', label: 'Breed' },
  { key: 'animal_name', label: 'Animal Name' },
  { key: 'heat_date', label: 'Heat Date' },
];

export default function Heat() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState(getInitialHeatForm);
  const [editForm, setEditForm] = useState(getInitialHeatForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    const [r, a] = await Promise.all([
      heatAPI.list({ limit: 200 }),
      animalsAPI.list({ limit: 200 }),
    ]);
    setRecords(r.data?.records || []);
    setAnimals(a.data?.animals || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const closeAdd = () => {
    setShowAdd(false);
    setForm(getInitialHeatForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialHeatForm());
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildHeatPayload(form);
      const res = await heatAPI.create(payload);
      toast.success(res.data?.message || 'Heat record added');
      closeAdd();
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving heat record';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildHeatPayload(editForm);
      const res = await heatAPI.update(editId, payload);
      toast.success(res.data?.message || 'Heat record updated');
      closeEdit();
      await load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error updating heat record';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await heatAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(heatFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.tag_number, r.animal_name, r.breed, r.heat_date]
      .some((v) => String(v || '').toLowerCase().includes(q));
  });

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
            <HeatFormFields form={formState} setForm={setFormState} animals={animals} />
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
            <Thermometer size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Heat
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Track heat cycles
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          {/* <button type="button" className="btn-primary flex items-center gap-2" onClick={() => setShowAdd(true)}>
            <Plus size={18} />
            Add Record
          </button> */}
        </div>
      </div>

      <AdminTablePanel noPadding>
          <table className="w-full admin-data-table">
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
                        style={{ background: 'rgba(168,85,247,.08)', color: '#a855f7' }}
                      >
                        <Thermometer size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No records yet'}
                      </p>
                      <p className="text-sm">Add a heat record to get started</p>
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
                      <span className="font-mono text-sm font-medium" style={{ color: 'var(--text-soft)' }}>
                        #{r.tag_number || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.breed || '-'}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(168,85,247,.12)', color: '#a855f7' }}
                        >
                          <Beef size={16} />
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                          {r.animal_name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.heat_date || '-'}
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
      </AdminTablePanel>

      {showAdd && renderModal('Add Heat Record', form, setForm, handleAdd, closeAdd, 'Save Record')}
      {showEdit && renderModal('Edit Heat Record', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
