import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { stockAPI } from '../services/api';
import { Plus, Save, X, Search, Edit2, Trash2, Milk as MilkIcon, FileText, Book, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import StockFormFields from '../components/stock/StockFormFields';
import { getInitialStockForm, buildStockPayload, stockFromRecord } from '../utils/stockForm';

const TAB_ACTIONS = [
  { key: 'Entry', label: 'Entry', icon: Plus, path: '/muktifarm/admin/milk/entry' },
  { key: 'View', label: 'View', icon: FileText, path: '/muktifarm/admin/milk/view' },
  { key: 'Products Log', label: 'Products Log', icon: Book, path: '/muktifarm/admin/milk/products-log' },
  { key: 'Donations Log', label: 'Donations Log', icon: DollarSign, path: '/muktifarm/admin/milk/donations-log' },
];

const VIEW_COLUMNS = [
  { label: 'Entry Date', key: 'entry_date' },
  { label: 'Item Name', key: 'item_name' },
  { label: 'Category', key: 'category' },
  { label: 'Batch Code', key: 'batch_code' },
  { label: 'Stock Quantity', key: 'quantity', align: 'right' },
  { label: 'Item Type', key: 'item_type' },
  { label: 'Bill Date', key: 'bill_date' },
  { label: 'Bill Code', key: 'bill_code' },
];

const DONATION_COLUMNS = [
  { label: 'Entry Date', key: 'entry_date' },
  { label: 'Item Name', key: 'item_name' },
  { label: 'Category', key: 'category' },
  { label: 'Donor', key: 'donor' },
  { label: 'Stock Quantity', key: 'quantity', align: 'right' },
  { label: 'Item Type', key: 'item_type' },
  { label: 'Bill Date', key: 'bill_date' },
];

const FULL_COLUMNS = [
  { label: 'ID', key: 'id' },
  { label: 'Entry Date', key: 'entry_date' },
  { label: 'Item Name', key: 'item_name' },
  { label: 'Category', key: 'category' },
  { label: 'Sub Category', key: 'sub_category' },
  { label: 'Batch Code', key: 'batch_code' },
  { label: 'Stock Qty', key: 'quantity', align: 'right' },
  { label: 'Item Type', key: 'item_type' },
  { label: 'Bill Date', key: 'bill_date' },
  { label: 'Bill Code', key: 'bill_code' },
  { label: 'Supplier', key: 'supplier' },
  { label: 'Supplier Type', key: 'supplier_type' },
  { label: 'Donor', key: 'donor' },
  { label: 'Remarks', key: 'remarks' },
];

export default function Milk() {
  const [records, setRecords] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(getInitialStockForm);
  const [editForm, setEditForm] = useState(getInitialStockForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Entry');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.endsWith('/products-log')) setActiveTab('Products Log');
    else if (location.pathname.endsWith('/donations-log')) setActiveTab('Donations Log');
    else if (location.pathname.endsWith('/view')) setActiveTab('View');
    else setActiveTab('Entry');

    setShowForm(location.pathname.endsWith('/entry') || location.pathname.endsWith('/milk'));
  }, [location.pathname]);

  const pageSubtitle =
    activeTab === 'Products Log'
      ? 'Browse product stock records'
      : activeTab === 'Donations Log'
        ? 'View donation stock records'
        : activeTab === 'View'
          ? 'Browse stock records'
          : 'Record stock entries';

  const isViewMode = activeTab === 'View';
  const isDonationMode = activeTab === 'Donations Log';
  const isProductsMode = activeTab === 'Products Log';

  const handleActionClick = (tab) => {
    setActiveTab(tab.key);
    if (tab.key === 'Entry') {
      setForm(getInitialStockForm());
      setShowForm(true);
      navigate(tab.path);
    } else {
      setShowForm(false);
      navigate(tab.path);
    }
  };

  const load = async () => {
    try {
      const [r, i] = await Promise.all([
        stockAPI.list({ limit: 500 }),
        stockAPI.listItems(),
      ]);
      setRecords(r.data?.records || []);
      setItems(i.data?.items || []);
    } catch {
      /* list may fail if not logged in */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeAdd = () => {
    setShowForm(false);
    setForm(getInitialStockForm());
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditId(null);
    setEditForm(getInitialStockForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildStockPayload(form);
      const res = await stockAPI.create(payload);
      toast.success(res.data?.message || 'Stock record added');
      closeAdd();
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving stock record';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildStockPayload(editForm);
      const res = await stockAPI.update(editId, payload);
      toast.success(res.data?.message || 'Stock record updated');
      closeEdit();
      await load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error updating stock record';
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await stockAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const openEdit = (r) => {
    setEditForm(stockFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const tabFiltered = records.filter((r) => {
    if (isDonationMode) {
      return Boolean(r.donor) || String(r.supplier_type || '').toLowerCase() === 'donation';
    }
    if (isProductsMode) {
      return String(r.item_type || '').toLowerCase() === 'product';
    }
    return true;
  });

  const filtered = tabFiltered.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [
      r.id,
      r.entry_date,
      r.item_name,
      r.item_type,
      r.category,
      r.sub_category,
      r.batch_code,
      r.quantity,
      r.unit,
      r.supplier,
      r.donor,
      r.supplier_type,
      r.bill_code,
      r.bill_date,
      r.remarks,
    ].some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  const columns = isViewMode ? VIEW_COLUMNS : isDonationMode ? DONATION_COLUMNS : FULL_COLUMNS;
  const showActions = !isViewMode && !isDonationMode && !isProductsMode;

  const renderCell = (r, col) => {
    if (col.key === 'quantity') {
      return r.quantity != null ? `${r.quantity} ${r.unit || ''}`.trim() : '-';
    }
    return r[col.key] ?? '-';
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
            <StockFormFields form={formState} setForm={setFormState} items={items} />
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
            style={{ background: 'rgba(59,130,246,.12)', color: '#3b82f6' }}
          >
            <MilkIcon size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Stock
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {pageSubtitle}
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

      <div className="flex flex-wrap gap-3">
        {TAB_ACTIONS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          const gradient =
            tab.key === 'Entry'
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : tab.key === 'View'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : tab.key === 'Products Log'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)';
          const desc =
            tab.key === 'Entry'
              ? 'Add stock record'
              : tab.key === 'View'
                ? 'View records'
                : tab.key === 'Products Log'
                  ? 'Product entries'
                  : 'Donation entries';
          return (
            <motion.button
              key={tab.key}
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleActionClick(tab)}
              style={{
                background: gradient,
                border: 'none',
                borderRadius: 12,
                padding: '12px 22px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: isActive ? '0 10px 30px rgba(0,0,0,0.2)' : '0 4px 14px rgba(0,0,0,0.1)',
                opacity: isActive ? 1 : 0.95,
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
                <Icon size={16} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{tab.label}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: isViewMode || isDonationMode ? '1000px' : '1400px' }}>
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-3 whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {col.label}
                  </th>
                ))}
                {showActions && <th className="text-right px-3 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    className="text-center py-16"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(59,130,246,.08)', color: '#3b82f6' }}
                      >
                        <MilkIcon size={28} />
                      </div>
                      <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {search ? 'No matches found' : 'No records yet'}
                      </p>
                      <p className="text-sm">Add a stock entry using the Entry tab</p>
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
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-3 text-sm whitespace-nowrap ${col.align === 'right' ? 'text-right font-medium' : ''}`}
                        style={{ color: col.align === 'right' ? 'var(--text)' : 'var(--text-muted)' }}
                      >
                        {renderCell(r, col)}
                      </td>
                    ))}
                    {showActions && (
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && renderModal('New Stock Entry', form, setForm, handleSubmit, closeAdd, 'Save Entry')}
      {showEdit && renderModal('Edit Stock Record', editForm, setEditForm, handleUpdate, closeEdit, 'Save Changes')}
    </motion.div>
  );
}
