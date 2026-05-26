import { useState, useEffect } from 'react';
import { feedAPI, animalsAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Apple, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminTablePanel from '../components/layout/AdminTablePanel';

export default function Feed() {
  const [records, setRecords] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [tab, setTab] = useState('consumption');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('consumption');
  const [form, setForm] = useState({ animal_id: '', feed_type: '', quantity_kg: '', notes: '', feed_name: '', stock_kg: '', unit_cost: '' });

  const load = async () => {
    try {
      const [r, i, a] = await Promise.all([
        feedAPI.list({ limit: 100 }),
        feedAPI.inventory(),
        animalsAPI.list({ limit: 200 })
      ]);
      setRecords(r.data.records || []);
      setInventory(i.data.inventory || []);
      setAnimals(a.data.animals || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'consumption') {
        await feedAPI.create({ animal_id: parseInt(form.animal_id), feed_type: form.feed_type, quantity_kg: parseFloat(form.quantity_kg), notes: form.notes });
        toast.success('Consumption recorded');
      } else {
        await feedAPI.addStock({ feed_name: form.feed_name, stock_kg: parseFloat(form.stock_kg), unit_cost: parseFloat(form.unit_cost) || null });
        toast.success('Stock added');
      }
      setShowForm(false);
      setForm({ animal_id: '', feed_type: '', quantity_kg: '', notes: '', feed_name: '', stock_kg: '', unit_cost: '' });
      load();
    } catch { toast.error('Error saving'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feed Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track consumption & inventory</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setFormType('consumption'); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Record Feed
          </button>
          <button onClick={() => { setFormType('stock'); setShowForm(true); }} className="btn-outline flex items-center gap-2">
            <Package size={18} /> Add Stock
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setTab('consumption')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'consumption' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <Apple size={16} className="inline mr-1.5" /> Consumption
        </button>
        <button onClick={() => setTab('inventory')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'inventory' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <Package size={16} className="inline mr-1.5" /> Inventory
        </button>
      </div>

      {tab === 'consumption' ? (
        <AdminTablePanel noPadding>
        <table className="w-full admin-data-table">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Animal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Feed Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quantity (kg)</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">No records</td></tr>
              ) : records.map(r => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.consumption_date}</td>
                  <td className="px-4 py-3 text-sm font-medium">{r.animal_name || `#${r.animal_id}`}</td>
                  <td className="px-4 py-3 text-sm">{r.feed_type}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">{r.quantity_kg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
      </AdminTablePanel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">No inventory items</div>
          ) : inventory.map(i => (
            <div key={i.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">{i.feed_name}</h3>
                <span className={`badge ${parseFloat(i.stock_kg) <= parseFloat(i.low_stock_threshold || 0) ? 'badge-danger' : 'badge-success'}`}>
                  {parseFloat(i.stock_kg).toFixed(1)} kg
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (parseFloat(i.stock_kg) / 500) * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Cost: ₹{i.unit_cost || 0}/kg</span>
                <span>Low: {i.low_stock_threshold || 0} kg</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)} />
          <div className="modal-container">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">{formType === 'consumption' ? 'Record Feed Consumption' : 'Add Feed Stock'}</h2>
                <button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formType === 'consumption' ? (
                  <>
                    <div><label className="block text-sm font-medium mb-1">Animal *</label>
                      <select className="input-field" value={form.animal_id} onChange={e => setForm({...form, animal_id: e.target.value})} required>
                        <option value="">Select animal</option>
                        {animals.filter(a => a.status === 'active').map(a => (
                          <option key={a.id} value={a.id}>{a.name} (#{a.tag_number})</option>
                        ))}
                      </select></div>
                    <div><label className="block text-sm font-medium mb-1">Feed Type</label>
                      <input className="input-field" value={form.feed_type} onChange={e => setForm({...form, feed_type: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Quantity (kg) *</label>
                      <input type="number" step="0.1" className="input-field" value={form.quantity_kg} onChange={e => setForm({...form, quantity_kg: e.target.value})} required /></div>
                    <div><label className="block text-sm font-medium mb-1">Notes</label>
                      <input className="input-field" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
                  </>
                ) : (
                  <>
                    <div><label className="block text-sm font-medium mb-1">Feed Name *</label>
                      <input className="input-field" value={form.feed_name} onChange={e => setForm({...form, feed_name: e.target.value})} required /></div>
                    <div><label className="block text-sm font-medium mb-1">Stock (kg) *</label>
                      <input type="number" step="0.1" className="input-field" value={form.stock_kg} onChange={e => setForm({...form, stock_kg: e.target.value})} required /></div>
                    <div><label className="block text-sm font-medium mb-1">Unit Cost (₹)</label>
                      <input type="number" className="input-field" value={form.unit_cost} onChange={e => setForm({...form, unit_cost: e.target.value})} /></div>
                  </>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
