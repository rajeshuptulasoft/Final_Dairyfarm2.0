import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dailyFoodAPI } from '../services/api';
import { Search, Trash2, Beef, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const TABLE_FIELDS = [
  { key: 'food_date', label: 'Food Date' },
  { key: 'tag_number', label: 'Animal Tag' },
  { key: 'animal_name', label: 'Animal Name' },
  { key: 'time_of_day', label: 'Time of Day' },
  { key: 'item_name', label: 'Item Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'unit', label: 'Unit' },
  { key: 'remarks', label: 'Remarks' },
];

export default function DailyFood() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const listRes = await dailyFoodAPI.list({ limit: 100 });
      setRecords(listRes.data?.records || []);
    } catch {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await dailyFoodAPI.delete(id);
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
      String(r.food_date || '').includes(q)
    );
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Daily Food Records
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Log new entries from All Animals → Daily Food
          </p>
        </div>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={() => navigate('/muktifarm/admin/animals', { state: { openDailyFood: true } })}
        >
          <Plus size={16} />
          Daily Food Log
        </button>
      </div>

      <div className="card overflow-hidden">
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
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{r.food_date}</td>
                    <td className="px-4 py-3 text-sm font-mono">{r.tag_number || '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Beef size={14} style={{ color: '#10b981' }} />
                        {r.animal_name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.time_of_day || 'Morning'}</td>
                    <td className="px-4 py-3 text-sm">{r.item_name || 'chokada'}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.quantity}</td>
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
