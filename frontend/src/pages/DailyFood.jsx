import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { animalsAPI, feedAPI } from '../services/api';
import { Save, Search, Trash2, Beef } from 'lucide-react';
import toast from 'react-hot-toast';

const today = () => new Date().toISOString().split('T')[0];

const initForm = {
  feed_date: today(),
  tag_number: '',
  animal_id: '',
  animal_name: '',
  session: 'morning',
  item_name: 'chokada',
  quantity: '',
  unit: 'bottle',
  remarks: '',
};

const TABLE_FIELDS = [
  { key: 'feed_date', label: 'Food Date' },
  { key: 'tag_number', label: 'Animal Tag' },
  { key: 'animal_name', label: 'Animal Name' },
  { key: 'session', label: 'Time of Day' },
  { key: 'item_name', label: 'Item Name' },
  { key: 'quantity_kg', label: 'Quantity' },
  { key: 'unit', label: 'Unit' },
  { key: 'remarks', label: 'Remarks' },
];

const sessionOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const unitOptions = ['bottle', 'Kg', 'L', 'g', 'pack'];

function FieldRow({ label, required, children }) {
  return (
    <div className="daily-food-field-row">
      <label className="daily-food-label-inline">
        {required && <span className="daily-food-required">*</span>} {label}
      </label>
      <div className="daily-food-field-control">{children}</div>
    </div>
  );
}

export default function DailyFood() {
  const [animals, setAnimals] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const cows = useMemo(
    () => animals.filter((a) => a.status === 'active' && a.tag_number),
    [animals]
  );

  const nameOptions = useMemo(() => {
    if (form.tag_number) {
      const match = cows.find((a) => String(a.tag_number) === String(form.tag_number));
      return match ? [match] : cows;
    }
    return cows;
  }, [cows, form.tag_number]);

  const itemOptions = useMemo(() => {
    if (feedItems.length > 0) return feedItems;
    return [{ id: null, feed_name: 'chokada' }];
  }, [feedItems]);

  const selectedFeedId = useMemo(() => {
    const item = feedItems.find(
      (i) => String(i.feed_name || '').toLowerCase() === String(form.item_name || '').toLowerCase()
    );
    return item?.id || feedItems[0]?.id || null;
  }, [feedItems, form.item_name]);

  const load = async () => {
    setLoading(true);
    try {
      const [animalRes, feedRes, listRes] = await Promise.all([
        animalsAPI.list({ limit: 500 }),
        feedAPI.inventory(),
        feedAPI.list({ limit: 100 }),
      ]);
      const animalList = animalRes.data?.animals || [];
      setAnimals(animalList);
      const items = feedRes.data?.items || feedRes.data?.inventory || [];
      setFeedItems(items.length ? items : [{ id: null, feed_name: 'chokada' }]);
      const defaultItem = items.find((i) =>
        String(i.feed_name || '').toLowerCase().includes('chok')
      );
      const rows = (listRes.data?.records || []).map((r) => {
        const animal = animalList.find((a) => String(a.id) === String(r.animal_id));
        const notes = r.notes || '';
        const unitMatch = notes.match(/Unit:\s*([^|]+)/i);
        const unit = unitMatch ? unitMatch[1].trim() : 'bottle';
        const remarks = notes.replace(/Unit:\s*[^|]+\s*\|?\s*/i, '').trim();
        return {
          ...r,
          tag_number: animal?.tag_number || '',
          animal_name: r.animal_name || animal?.name || '',
          item_name: (r.feed_name || 'chokada').toLowerCase(),
          unit,
          remarks,
          session: r.session || 'morning',
        };
      });
      setRecords(rows);
      if (defaultItem && !form.item_name) {
        setForm((f) => ({
          ...f,
          item_name: String(defaultItem.feed_name).toLowerCase(),
        }));
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onTagChange = (tag) => {
    const animal = cows.find((a) => String(a.tag_number) === String(tag));
    setForm((f) => ({
      ...f,
      tag_number: tag,
      animal_id: animal ? String(animal.id) : '',
      animal_name: animal?.name || '',
    }));
  };

  const onNameChange = (animalId) => {
    const animal = cows.find((a) => String(a.id) === String(animalId));
    setForm((f) => ({
      ...f,
      animal_id: animalId,
      animal_name: animal?.name || '',
      tag_number: animal ? String(animal.tag_number) : '',
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.animal_id) {
      toast.error('Please select Animal Tag');
      return;
    }
    if (!selectedFeedId) {
      toast.error('Item Name (chokada) not found in feed inventory');
      return;
    }
    if (!form.quantity) {
      toast.error('Please enter Quantity');
      return;
    }
    setSaving(true);
    try {
      const noteParts = [];
      if (form.unit) noteParts.push(`Unit: ${form.unit}`);
      if (form.remarks) noteParts.push(form.remarks);
      await feedAPI.create({
        animal_id: parseInt(form.animal_id, 10),
        feed_id: selectedFeedId,
        quantity_kg: parseFloat(form.quantity),
        feed_date: form.feed_date,
        session: form.session,
        notes: noteParts.join(' | ') || null,
      });
      toast.success('Daily food record saved');
      setForm({
        ...initForm,
        feed_date: today(),
        item_name: 'chokada',
        unit: 'bottle',
      });
      await load();
    } catch {
      toast.error('Error saving record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await feedAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Could not delete');
    }
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(r.animal_name || '').toLowerCase().includes(q) ||
      String(r.tag_number || '').toLowerCase().includes(q) ||
      String(r.feed_date || '').includes(q)
    );
  });

  const sessionLabel = (s) =>
    sessionOptions.find((o) => o.value === s)?.label || s;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page daily-food-page">
      <div className="daily-food-form-panel mx-auto">
        <div className="daily-food-top-bar">
          <h1 className="daily-food-title-center">
            <span className="daily-food-title-icon" aria-hidden>🐄</span>
            Daily Food
          </h1>
          <button
            type="submit"
            form="daily-food-form"
            disabled={saving}
            className="daily-food-save-btn"
          >
            {saving ? 'Saving...' : 'SAVE'}
          </button>
        </div>

        <form id="daily-food-form" onSubmit={handleSave} className="daily-food-form-grid">
          {/* Left column — exact order from reference image */}
          <div className="daily-food-column">
            <FieldRow label="Food Date" required>
              <input
                type="date"
                className="daily-food-input"
                value={form.feed_date}
                onChange={(e) => setForm({ ...form, feed_date: e.target.value })}
                required
              />
            </FieldRow>

            <FieldRow label="Animal Tag :" required>
              <select
                className="daily-food-input"
                value={form.tag_number}
                onChange={(e) => onTagChange(e.target.value)}
                required
              >
                <option value="">Select tag</option>
                {cows.map((a) => (
                  <option key={a.id} value={a.tag_number}>
                    {a.tag_number}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Animal Name :" required>
              <select
                className="daily-food-input"
                value={form.animal_id}
                onChange={(e) => onNameChange(e.target.value)}
                required
              >
                <option value="">Select name</option>
                {nameOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || `Cow #${a.tag_number}`}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Time of Day">
              <select
                className="daily-food-input"
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
              >
                {sessionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FieldRow>
          </div>

          {/* Right column — exact order from reference image */}
          <div className="daily-food-column">
            <FieldRow label="Item Name" required>
              <select
                className="daily-food-input"
                value={form.item_name}
                onChange={(e) =>
                  setForm({ ...form, item_name: e.target.value.toLowerCase() })
                }
                required
              >
                {itemOptions.map((item, idx) => (
                  <option
                    key={item.id || `feed-${idx}`}
                    value={String(item.feed_name || 'chokada').toLowerCase()}
                  >
                    {String(item.feed_name || 'chokada').toLowerCase()}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Quantity" required>
              <input
                type="number"
                step="0.01"
                min="0"
                className="daily-food-input"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </FieldRow>

            <FieldRow label="Unit" required>
              <select
                className="daily-food-input"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                required
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Remarks :">
              <textarea
                className="daily-food-input daily-food-textarea"
                rows={4}
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </FieldRow>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden mx-auto daily-food-table-card">
        <div
          className="p-4 border-b flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            Recent Records
          </h2>
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-soft)' }}
            />
            <input
              className="input-field pl-9 text-sm w-full"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto admin-table-scroll">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {TABLE_FIELDS.map((f) => (
                  <th
                    key={f.key}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={TABLE_FIELDS.length + 1} className="text-center py-12">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_FIELDS.length + 1}
                    className="text-center py-12"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No daily food records yet
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{r.feed_date}</td>
                    <td className="px-4 py-3 text-sm font-mono">{r.tag_number || '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Beef size={14} style={{ color: '#10b981' }} />
                        {r.animal_name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{sessionLabel(r.session)}</td>
                    <td className="px-4 py-3 text-sm">{r.item_name || 'chokada'}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.quantity_kg}</td>
                    <td className="px-4 py-3 text-sm">{r.unit || 'bottle'}</td>
                    <td className="px-4 py-3 text-sm max-w-[200px] truncate">{r.remarks || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="p-2 rounded-lg hover:bg-red-50"
                        style={{ color: '#ef4444' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
