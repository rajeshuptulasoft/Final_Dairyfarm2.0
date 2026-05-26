import { useState, useEffect } from 'react';
import { employeesAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, User, Mail, Shield, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', phone: '' });

  const load = async () => {
    try {
      const res = await employeesAPI.list();
      setEmployees(res.data.employees || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeesAPI.create(form);
      toast.success('Employee added');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'staff', phone: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error saving'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage farm staff</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Employee</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">No employees</div>
        ) : employees.map(e => (
          <div key={e.id} className="card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{e.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500"><Mail size={12} />{e.email}</div>
                {e.phone && <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500"><Phone size={12} />{e.phone}</div>}
              </div>
              <div className="flex-shrink-0">
                <span className={`badge ${e.role === 'admin' ? 'badge-danger' : e.role === 'manager' ? 'badge-warning' : 'badge-info'}`}>{e.role}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>Joined: {e.created_at?.split('T')[0]}</span>
              <span className={e.is_active ? 'text-green-500' : 'text-red-500'}>{e.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)} />
          <div className="modal-container">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Employee</h2>
                <button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1">Password *</label>
                  <input type="password" className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Role</label>
                    <select className="input-field" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option>
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1">Phone</label>
                    <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">Add Employee</button>
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
