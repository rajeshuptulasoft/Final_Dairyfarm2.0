import { useState, useEffect } from 'react';
import { healthAPI, animalsAPI, calvedAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Activity, Save, X, Search, Edit2, Trash2, Beef, Heart, Calendar, Book } from 'lucide-react';
import toast from 'react-hot-toast';
import ModalPortal from '../components/ui/ModalPortal';
import HealthFormFields from '../components/health/HealthFormFields';
import { getInitialHealthForm, buildHealthPayload, healthFromRecord } from '../utils/healthForm';
import { buildBreedingPayload } from '../utils/breedingForm';
import { getInitialPregnancyForm, buildPregnancyPayload } from '../utils/pregnancyForm';
import PregnancyFormFields from '../components/pregnancy/PregnancyFormFields';
import CalvedFormFields from '../components/calved/CalvedFormFields';
import { getInitialCalvedForm, buildCalvedPayload } from '../utils/calvedForm';

const today = () => new Date().toISOString().split('T')[0];


const healthTabs = [
  { key: 'Health Log', label: 'Health Log', icon: Activity, gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', desc: 'Record health issues' },
  { key: 'Breeding', label: 'Breeding', icon: Heart, gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', desc: 'Track breeding cycles' },
  { key: 'Pregnancy', label: 'Pregnancy', icon: Calendar, gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', desc: 'Monitor pregnancies' },
  { key: 'Calved', label: 'Calved', icon: Book, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', desc: 'View calvings' },
];

const FIELDS = [
  { key: 'health_issue_date', label: 'Date', type: 'date' },
  { key: 'animal_name', label: 'Animal', type: 'text' },
  { key: 'doctor_name', label: 'Doctor', type: 'text' },
  { key: 'symptoms', label: 'Symptoms', type: 'text' },
  { key: 'remedy_taken', label: 'RemedyTaken', type: 'text' },
  { key: 'remedy_suggested', label: 'RemedySuggested', type: 'text' },
  { key: 'estimated_cost', label: 'EstCost(₹)', type: 'text' },
  { key: 'doctor_charges', label: 'DrCharges(₹)', type: 'text' },
  { key: 'paid', label: 'Paid', type: 'text' },
  { key: 'remarks', label: 'Remarks', type: 'text' },
];

export default function Health() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState(getInitialHealthForm);
  const [breedingForm, setBreedingForm] = useState({
    animal_id: '', breeding_date: today(), method: 'natural', sire_info: '', notes: '',
  });
  const [pregnancyForm, setPregnancyForm] = useState(getInitialPregnancyForm);
  const [editForm, setEditForm] = useState(getInitialHealthForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showBreedingForm, setShowBreedingForm] = useState(false);
  const [showCalvedForm, setShowCalvedForm] = useState(false);
  const [calvedForm, setCalvedForm] = useState(getInitialCalvedForm);
  const [showPregnancyForm, setShowPregnancyForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const [r, a] = await Promise.all([healthAPI.list({ limit: 200 }), animalsAPI.list({ limit: 200 })]);
      setRecords(r.data.records || []);
      setAnimals(a.data?.animals || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const healthErrorMessage = (err) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    'Error saving health record';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildHealthPayload(form);
      const res = await healthAPI.create(payload);
      toast.success(res.data?.message || 'Health record added');
      setShowForm(false);
      setForm(getInitialHealthForm());
      await load();
    } catch (err) {
      toast.error(healthErrorMessage(err));
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildHealthPayload(editForm);
      const res = await healthAPI.update(editId, payload);
      toast.success(res.data?.message || 'Health record updated');
      setShowEdit(false);
      setEditId(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating health record');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try { await healthAPI.delete(id); toast.success('Deleted'); await load(); }
    catch { toast.error('Error deleting'); }
  };

  const handleBreedingSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await breedingAPI.create(buildBreedingPayload(breedingForm));
      toast.success('Breeding record added');
      setShowBreedingForm(false);
      setBreedingForm({ animal_id: '', breeding_date: today(), method: 'natural', sire_info: '', notes: '' });
      await load();
    } catch { toast.error('Error saving breeding'); }
    setSaving(false);
  };

  const handlePregnancySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pregnancyAPI.create(buildPregnancyPayload(pregnancyForm));
      toast.success('Pregnancy record added');
      setShowPregnancyForm(false);
      setPregnancyForm(getInitialPregnancyForm());
      await load();
    } catch { toast.error('Error saving pregnancy'); }
    setSaving(false);
  };

  const handleCalvedSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await calvedAPI.create(buildCalvedPayload(calvedForm));
      toast.success(res.data?.message || 'Calving record saved');
      setShowCalvedForm(false);
      setCalvedForm(getInitialCalvedForm());
      await load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving calving record';
      toast.error(msg);
    }
    setSaving(false);
  };

  const openEdit = (r) => {
    setEditForm(healthFromRecord(r));
    setEditId(r.id);
    setShowEdit(true);
  };

  const getDisplayVal = (r, key) => {
    if (key === 'animal_name') return r.animal_name || `#${r.animal_id || '-'}`;
    if (key === 'symptoms') return r.symptoms || r.diagnosis || '-';
    if (key === 'remedy_taken') return r.remedy_taken || '-';
    if (key === 'remedy_suggested') return r.remedy_suggested || '-';
    if (key === 'estimated_cost') return r.estimated_cost || '-';
    if (key === 'doctor_charges') return r.doctor_charges || '-';
    if (key === 'remarks') return r.remarks || r.notes || '-';
    if (key === 'paid') {
      const v = r.paid || '';
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
          style={{
            background: v === 'yes' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
            color: v === 'yes' ? '#16a34a' : '#dc2626',
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: v === 'yes' ? '#22c55e' : '#ef4444' }} />
          {v || '-'}
        </span>
      );
    }
    return r[key] || '-';
  };

  const handleTabClick = (tab) => {
    if (tab.key === 'Calved') { setCalvedForm(getInitialCalvedForm()); setShowCalvedForm(true); return; }
    if (tab.key === 'Health Log') { setForm(getInitialHealthForm()); setShowForm(true); return; }
    if (tab.key === 'Breeding') { setBreedingForm({ animal_id: '', breeding_date: today(), method: 'natural', sire_info: '', notes: '' }); setShowBreedingForm(true); return; }
    if (tab.key === 'Pregnancy') { setPregnancyForm(getInitialPregnancyForm()); setShowPregnancyForm(true); return; }
  };

  const filtered = records.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return FIELDS.some(f => {
      if (f.key === 'symptoms') return String(r.symptoms || r.diagnosis || '').toLowerCase().includes(q);
      if (f.key === 'remarks') return String(r.remarks || r.notes || '').toLowerCase().includes(q);
      return String(r[f.key] || '').toLowerCase().includes(q);
    });
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,.12)', color: '#ef4444' }}>
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Health Care</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track animal health & treatments</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}><X size={14} /></button>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {healthTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <motion.button key={tab.key} whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }} whileTap={{ scale: 0.96 }}
              onClick={() => handleTabClick(tab)}
              style={{
                background: tab.gradient, border: 'none', borderRadius: 12, padding: '12px 22px',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontFamily: 'inherit', position: 'relative', overflow: 'hidden'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                <Icon size={16} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>{tab.label}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{tab.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>


      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1200px' }}>
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {FIELDS.map(f => (
                  <th key={f.key} className="text-left px-3 py-3 whitespace-nowrap">{f.label}</th>
                ))}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={FIELDS.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,.08)', color: '#ef4444' }}>
                      <Activity size={28} />
                    </div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>{search ? 'No matches found' : 'No records yet'}</p>
                    <p className="text-sm">Add your first health record using Health Log button</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id || i}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}>
                    {FIELDS.map(f => {
                      if (f.key === 'animal_name') {
                        return (
                          <td key={f.key} className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,.12)', color: '#ef4444' }}>
                                <Beef size={16} />
                              </div>
                              <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{r.animal_name || `#${r.animal_id || '-'}`}</span>
                            </div>
                          </td>
                        );
                      }
                      if (f.key === 'health_issue_date') {
                        return <td key={f.key} className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{r.health_issue_date || r.health_date || '-'}</td>;
                      }
                      return (
                        <td key={f.key} className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                          {getDisplayVal(r, f.key)}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: '#3b82f6' }}>
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: '#ef4444' }}>
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

      {/* Health Log Modal */}
      {showForm && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">New Health Record</h2>
                <button onClick={() => setShowForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <HealthFormFields form={form} setForm={setForm} animals={animals} />
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Register'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
        </ModalPortal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => { setShowEdit(false); setEditId(null); }} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Edit Health Record</h2>
                <button onClick={() => { setShowEdit(false); setEditId(null); }} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleUpdate}>
                <HealthFormFields form={editForm} setForm={setEditForm} animals={animals} />
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => { setShowEdit(false); setEditId(null); }} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
        </ModalPortal>
      )}

      {/* Breeding Modal */}
      {showBreedingForm && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => setShowBreedingForm(false)} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">New Breeding Record</h2>
                <button onClick={() => setShowBreedingForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleBreedingSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Animal *</label>
                    <select className="input-field text-sm" value={breedingForm.animal_id} onChange={e => setBreedingForm({...breedingForm, animal_id: e.target.value})} required>
                      <option value="">Select animal</option>
                      {animals.filter(a => a.status === 'active' && a.gender === 'female').map(a => (
                        <option key={a.id} value={a.id}>{a.name} (#{a.tag_number})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Breeding Date</label>
                    <input type="date" className="input-field text-sm" value={breedingForm.breeding_date} onChange={e => setBreedingForm({...breedingForm, breeding_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Method</label>
                    <select className="input-field text-sm" value={breedingForm.method} onChange={e => setBreedingForm({...breedingForm, method: e.target.value})}>
                      <option value="natural">Natural</option>
                      <option value="artificial">Artificial Insemination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sire Info</label>
                    <input className="input-field text-sm" value={breedingForm.sire_info} onChange={e => setBreedingForm({...breedingForm, sire_info: e.target.value})} placeholder="Enter sire information" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Notes</label>
                    <textarea className="input-field text-sm" rows={3} value={breedingForm.notes} onChange={e => setBreedingForm({...breedingForm, notes: e.target.value})} placeholder="Enter notes" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    Save
                  </button>
                  <button type="button" onClick={() => setShowBreedingForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
        </ModalPortal>
      )}

      {/* Pregnancy Modal */}
      {showPregnancyForm && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => setShowPregnancyForm(false)} />
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">New Pregnancy Record</h2>
                <button onClick={() => setShowPregnancyForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handlePregnancySubmit}>
                <PregnancyFormFields form={pregnancyForm} setForm={setPregnancyForm} animals={animals} />
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    Register
                  </button>
                  <button type="button" onClick={() => setShowPregnancyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
        </ModalPortal>
      )}

      {/* Calved Modal — combined health+breeding+pregnancy+calving */}
      {showCalvedForm && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => setShowCalvedForm(false)} />
          <div className="modal-container">
            <div className="modal-content" style={{ maxWidth: '900px' }}>
              <div className="modal-header">
                <h2 className="modal-title">Comprehensive Calving Record</h2>
                <button onClick={() => setShowCalvedForm(false)} className="modal-close-btn"><X size={28} /></button>
              </div>
              <form onSubmit={handleCalvedSubmit}>
                <CalvedFormFields form={calvedForm} setForm={setCalvedForm} animals={animals} />
                <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Register'}
                  </button>
                  <button type="button" onClick={() => setShowCalvedForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
        </ModalPortal>
      )}
    </motion.div>
  );
}
