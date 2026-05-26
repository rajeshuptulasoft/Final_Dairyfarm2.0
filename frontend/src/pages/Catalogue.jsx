import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { catalogueAPI, animalsAPI } from '../services/api';
import { Book, Plus, Save, X, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CatalogueFormFields from '../components/animals/CatalogueFormFields';
import {
  getInitialCatalogueForm,
  buildCataloguePayload,
  catalogueFromRecord,
} from '../utils/catalogueForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

const TABLE_COLUMNS = [
  { key: 'animal', label: 'Animal' },
  { key: 'animal_type', label: 'Animal Type' },
  { key: 'breed', label: 'Breed' },
  { key: 'milk_type', label: 'Milk Type' },
  { key: 'fat_percentage', label: 'Fat %' },
  { key: 'lactose_percentage', label: 'Lactose %' },
  { key: 'protein_percentage', label: 'Protein %' },
  { key: 'acidity_percentage', label: 'Acidity %' },
  { key: 'snf_percentage', label: 'SnF %' },
  { key: 'remarks', label: 'Remarks' },
];

export default function Catalogue() {
  const [items, setItems] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState(getInitialCatalogueForm);
  const [editForm, setEditForm] = useState(getInitialCatalogueForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    const [c, a] = await Promise.all([
      catalogueAPI.list({ limit: 200 }),
      animalsAPI.list({ limit: 200 }),
    ]);
    setItems(c.data?.records || []);
    setAnimals(a.data?.animals || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const closeAdd = () => {
    setShowAdd(false);
    setForm(getInitialCatalogueForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialCatalogueForm());
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildCataloguePayload(form);
      const res = await catalogueAPI.create(payload);
      toast.success(res.data?.message || 'Catalogue saved');
      closeAdd();
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving catalogue';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildCataloguePayload(editForm);
      const res = await catalogueAPI.update(editId, payload);
      toast.success(res.data?.message || 'Catalogue updated');
      closeEdit();
      await load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error updating catalogue';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await catalogueAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(catalogueFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      item.tag_number,
      item.animal_name,
      item.animal_type,
      item.breed,
      item.milk_type,
      item.fat_percentage,
      item.lactose_percentage,
      item.protein_percentage,
      item.acidity_percentage,
      item.snf_percentage,
      item.remarks,
    ].some((v) => String(v ?? '').toLowerCase().includes(q));
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
            <CatalogueFormFields form={formState} setForm={setFormState} animals={animals} />
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

  const cellValue = (item, col) => {
    if (col.key === 'animal') {
      const tag = item.tag_number ? `#${item.tag_number}` : '-';
      const name = item.animal_name ? ` — ${item.animal_name}` : '';
      return `${tag}${name}`;
    }
    return item[col.key] ?? '-';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,.12)', color: '#6366f1' }}
          >
            <Book size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Catalogue
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage animal catalogue
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
            Add Entry
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
                        style={{ background: 'rgba(99,102,241,.08)', color: '#6366f1' }}
                      >
                        <Book size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No items yet'}
                      </p>
                      <p className="text-sm">Add a catalogue entry to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr
                    key={item.id || i}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {TABLE_COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className="px-3 py-3 text-sm whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {cellValue(item, col)}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          style={{ color: '#3b82f6' }}
                        >
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(item.id)}
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

      {showAdd && renderModal('Add Catalogue Entry', form, setForm, handleAdd, closeAdd, 'Save Entry')}
      {showEdit && renderModal('Edit Catalogue Entry', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
