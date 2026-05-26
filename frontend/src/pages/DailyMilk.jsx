import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { milkAPI, animalsAPI } from '../services/api';
import { Plus, Save, X, Search, Edit2, Trash2, Milk, Beef } from 'lucide-react';
import toast from 'react-hot-toast';
import DailyMilkFormFields from '../components/animals/DailyMilkFormFields';
import {
  getInitialDailyMilkForm,
  buildDailyMilkPayload,
  dailyMilkFromRecord,
} from '../utils/dailyMilkForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

export default function DailyMilk() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState(getInitialDailyMilkForm);
  const [editForm, setEditForm] = useState(getInitialDailyMilkForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    const [r, a] = await Promise.all([
      milkAPI.list({ limit: 500 }),
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
    setForm(getInitialDailyMilkForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialDailyMilkForm());
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildDailyMilkPayload(form);
      await milkAPI.create(payload);
      console.log('Daily milk success:', payload);
      toast.success('Milk record added');
      closeAdd();
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.join?.(', ') ||
        'Error saving milk record';
      console.log('Daily milk error:', msg);
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildDailyMilkPayload(editForm);
      await milkAPI.update(editId, payload);
      console.log('Daily milk update success');
      toast.success('Milk record updated');
      closeEdit();
      await load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error updating milk record';
      console.log('Daily milk error:', msg);
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await milkAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(dailyMilkFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      r.milk_date,
      r.animal_name,
      r.tag_number,
      r.milk_type,
      r.quantity_ltr,
      r.time_of_day,
      r.collected_by,
    ].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const renderModal = (title, formState, setFormState, onSubmit, onClose, submitLabel) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card"
        style={{ maxWidth: 720, width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Milk size={20} style={{ color: '#3b82f6' }} />
            {title}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/[.04]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <DailyMilkFormFields form={formState} setForm={setFormState} animals={animals} />
          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : submitLabel}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,.12)', color: '#3b82f6' }}
          >
            <Milk size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Daily Milk
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Record daily milk production
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
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
          {/* <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setForm(getInitialDailyMilkForm());
              setShowAdd(true);
            }}
          >
            <Plus size={16} />
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
                <th className="text-left px-3 py-3">Date</th>
                <th className="text-left px-3 py-3">Tag</th>
                <th className="text-left px-3 py-3">Animal</th>
                <th className="text-left px-3 py-3">Milk Type</th>
                <th className="text-left px-3 py-3">Quantity</th>
                <th className="text-left px-3 py-3">Fat%</th>
                <th className="text-left px-3 py-3">Time</th>
                <th className="text-left px-3 py-3">Collected By</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <Milk size={28} style={{ color: '#3b82f6' }} />
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No milk records yet'}
                      </p>
                      {/* {!search && (
                        <button type="button" className="btn-primary mt-2" onClick={() => setShowAdd(true)}>
                          <Plus size={14} /> Add Record
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-3 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.milk_date || '-'}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-sm" style={{ color: 'var(--text-soft)' }}>
                        #{r.tag_number || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(59,130,246,.12)', color: '#3b82f6' }}
                        >
                          <Beef size={16} />
                        </div>
                        <span className="font-medium text-sm">{r.animal_name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">{r.milk_type || '-'}</td>
                    <td className="px-3 py-3 text-sm font-medium">
                      {r.quantity_ltr != null ? `${r.quantity_ltr} ${r.unit || 'Kg'}` : '-'}
                    </td>
                    <td className="px-3 py-3 text-sm">{r.fat_percentage ?? '-'}</td>
                    <td className="px-3 py-3 text-sm capitalize">{r.time_of_day || '-'}</td>
                    <td className="px-3 py-3 text-sm">{r.collected_by || '-'}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg"
                          style={{ color: '#3b82f6' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg"
                          style={{ color: '#ef4444' }}
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

      {showAdd && renderModal('Add Daily Milk', form, setForm, handleAdd, closeAdd, 'Save')}
      {showEdit && renderModal('Edit Milk Record', editForm, setEditForm, handleUpdate, closeEdit, 'Update')}
    </motion.div>
  );
}
