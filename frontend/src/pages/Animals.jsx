import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalsAPI, milkAPI, heatAPI, catalogueAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, Beef, Milk, Activity, Sparkles, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimalRegisterModal from '../components/animals/AnimalRegisterModal';
import { BREED_OPTIONS } from '../components/animals/AnimalRegisterFormFields';
import { initialAnimalForm, animalFromRecord, submitAnimal } from '../utils/animalForm';
import { getInitialDailyMilkForm, buildDailyMilkPayload } from '../utils/dailyMilkForm';
import DailyMilkFormFields from '../components/animals/DailyMilkFormFields';
import { getInitialHeatForm, buildHeatPayload } from '../utils/heatForm';
import HeatFormFields from '../components/animals/HeatFormFields';
import { getInitialCatalogueForm, buildCataloguePayload } from '../utils/catalogueForm';
import CatalogueFormFields from '../components/animals/CatalogueFormFields';

const ACTION_TABS = ['Register', 'Daily Milk', 'Daily Food', 'Heat', 'Catalogue'];

const actionBtnMeta = {
  Register: { icon: Sparkles, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', desc: 'Add new animal' },
  'Daily Milk': { icon: Milk, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', desc: 'Record milk yield' },
  'Daily Food': { icon: Activity, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', desc: 'Log feed intake' },
  Heat: { icon: CalendarDays, gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', desc: 'Track heat cycles' },
  Catalogue: { icon: Search, gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', desc: 'Browse catalogue' },
};

export default function Animals() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSaving, setRegisterSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialAnimalForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [activeAction, setActiveAction] = useState('Register');
  const [milkForm, setMilkForm] = useState(getInitialDailyMilkForm);
  const [heatForm, setHeatForm] = useState(getInitialHeatForm);
  const [catalogueForm, setCatalogueForm] = useState(getInitialCatalogueForm);

  const closeActionModal = () => {
    setShowForm(false);
    if (activeAction === 'Daily Milk') setMilkForm(getInitialDailyMilkForm());
    if (activeAction === 'Heat') setHeatForm(getInitialHeatForm());
    if (activeAction === 'Catalogue') setCatalogueForm(getInitialCatalogueForm());
  };

  const handleHeatSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildHeatPayload(heatForm);
      const res = await heatAPI.create(payload);
      toast.success(res.data?.message || 'Heat record saved');
      setHeatForm(getInitialHeatForm());
      closeActionModal();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving heat';
      toast.error(msg);
    }
  };
  const handleCatalogueSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildCataloguePayload(catalogueForm);
      const res = await catalogueAPI.create(payload);
      toast.success(res.data?.message || 'Catalogue saved');
      setCatalogueForm(getInitialCatalogueForm());
      closeActionModal();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.response?.data?.errors) ||
        'Error saving catalogue';
      toast.error(msg);
    }
  };
  const handleMilkSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildDailyMilkPayload(milkForm);
      await milkAPI.create(payload);
      console.log('Daily milk success:', payload);
      toast.success('Milk entry saved');
      setMilkForm(getInitialDailyMilkForm());
      closeActionModal();
      load();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.join?.(', ') ||
        'Error saving milk';
      console.log('Daily milk error:', msg);
      toast.error(msg);
    }
  };

  const load = async (p = page) => {
    setLoading(true);
    try { const res = await animalsAPI.list({ search, breed: breedFilter, page: p }); setAnimals(res.data.animals || []); setTotal(res.data.total || 0); }
    catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, breedFilter, page]);

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image_url: '' }));
  };

  const handleImageSelect = (file) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setEditing(null);
    setForm(initialAnimalForm);
    clearImage();
  };

  const openRegisterModal = (forEdit = false) => {
    if (!forEdit) {
      setEditing(null);
      setForm(initialAnimalForm);
      clearImage();
    }
    setShowRegisterModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterSaving(true);
    try {
      await submitAnimal({ form, imageFile, editingId: editing });
      console.log(editing ? 'Animal update success' : 'Animal register success');
      toast.success(editing ? 'Animal updated' : 'Animal registered');
      closeRegisterModal();
      load();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error saving animal';
      console.log('Animal register error:', msg);
      toast.error(msg);
    }
    setRegisterSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this animal?')) return;
    try { await animalsAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const edit = (a) => {
    clearImage();
    setForm(animalFromRecord(a));
    setEditing(a.id);
    openRegisterModal(true);
  };

  const pages = Math.ceil(total / 10);

  const activeCount = animals.filter(a => a.status === 'active').length;
  const soldCount = animals.filter(a => a.status === 'sold').length;
  const deadCount = animals.filter(a => a.status === 'dead').length;

  const statCards = [
    { label: 'Total Cattle', value: total, icon: Beef, color: '#3b82f6', bg: 'rgba(59,130,246,.1)' },
    { label: 'Active', value: activeCount, icon: Beef, color: '#22c55e', bg: 'rgba(34,197,94,.1)' },
    { label: 'Sold', value: soldCount, icon: Beef, color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
    { label: 'Deceased', value: deadCount, icon: Beef, color: '#8b5cf6', bg: 'rgba(139,92,246,.1)' },
  ];

  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const handleActionClick = (action) => {
    if (action === 'Daily Food') {
      navigate('/muktifarm/admin/animals/daily-food');
      return;
    }
    if (action === 'Register') {
      openRegisterModal();
      return;
    }
    if (action === 'Daily Milk') setMilkForm(getInitialDailyMilkForm());
    if (action === 'Heat') setHeatForm(getInitialHeatForm());
    if (action === 'Catalogue') setCatalogueForm(getInitialCatalogueForm());
    setActiveAction(action);
    setShowForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animals-page">

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="animals-header-panel flex items-start justify-between flex-wrap gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--white)' }}>Herd Management</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>{total} animals registered on your farm</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="show" className="grid grid-cols-4 gap-4 mb-5">
        {statCards.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="animal-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="animal-stat-icon" style={{ background: s.bg, color: s.color }}>
                <s.icon size={16} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial="hidden" animate="show" className="flex flex-wrap gap-3 mb-5">
        {ACTION_TABS.map((a) => {
          const meta = actionBtnMeta[a];
          const Icon = meta.icon;
          return (
            <motion.button key={a} whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }} whileTap={{ scale: 0.96 }}
              onClick={() => handleActionClick(a)}
              style={{
                background: meta.gradient, border: 'none', borderRadius: 12, padding: '12px 22px',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontFamily: 'inherit', position: 'relative', overflow: 'hidden'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                <Icon size={16} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>{a}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{meta.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Modal Overlay ── */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeActionModal(); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="card" style={{ maxWidth: 720, width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}
            onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              {activeAction === 'Daily Milk' ? (
                <Milk size={20} style={{ color: '#3b82f6' }} />
              ) : (
                <Beef size={20} style={{ color: '#f59e0b' }} />
              )}
              {activeAction}
            </h3>
            <button type="button" onClick={closeActionModal}
              className="p-1.5 rounded-lg hover:bg-black/[.04] dark:hover:bg-white/[.04]" style={{ color: 'var(--text-soft)' }}
              aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {activeAction === 'Daily Milk' ? (
            <form onSubmit={handleMilkSubmit} className="space-y-4">
              <DailyMilkFormFields form={milkForm} setForm={setMilkForm} animals={animals} />
              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={closeActionModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          ) : activeAction === 'Heat' ? (
            <form onSubmit={handleHeatSubmit} className="space-y-4">
              <HeatFormFields form={heatForm} setForm={setHeatForm} animals={animals} />
              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={closeActionModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          ) : activeAction === 'Catalogue' ? (
            <form onSubmit={handleCatalogueSubmit} className="space-y-4">
              <CatalogueFormFields form={catalogueForm} setForm={setCatalogueForm} animals={animals} />
              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={closeActionModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          ) : null}
        </motion.div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <motion.div initial="hidden" animate="show" className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search by name or tag..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}><X size={14} /></button>}
        </div>
        <select className="input-field w-auto" value={breedFilter} onChange={e => { setBreedFilter(e.target.value); setPage(1); }}>
          <option value="">All Breeds</option>
          {BREED_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <button type="button" className="btn-primary flex items-center gap-2 shrink-0" onClick={() => openRegisterModal()}>
          <Plus size={16} />
          Register
        </button>
      </motion.div>

      {showRegisterModal && (
        <AnimalRegisterModal
          title={editing ? 'Edit Animal' : 'Register'}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={closeRegisterModal}
          submitLabel={editing ? 'Update' : 'Register'}
          saving={registerSaving}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          onImageClear={clearImage}
        />
      )}

      {/* Premium Table */}
      <motion.div initial="hidden" animate="show" className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                <th className="text-left px-4 py-3">Tag</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Breed</th>
                <th className="text-left px-4 py-3">Gender</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded" style={{ width: j === 4 ? '50%' : '65%', background: 'var(--border)' }} /></td>
                    ))}
                  </tr>
                ))
              ) : animals.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,.08)', color: 'var(--primary)' }}>
                      <Beef size={28} />
                    </div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>No animals found</p>
                    <p className="text-sm">Add your first animal to start tracking</p>
                    <button type="button" className="btn-primary mt-2" onClick={() => openRegisterModal()}>
                      <Plus size={14} /> Add Animal
                    </button>
                  </div>
                </td></tr>
              ) : (
                animals.map((a, i) => (
                  <tr key={a.id}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium" style={{ color: 'var(--text-soft)' }}>#{a.tag_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,.12)', color: '#d97706' }}>
                          <Beef size={16} />
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{a.breed || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: a.gender === 'female' ? 'rgba(236,72,153,.1)' : 'rgba(59,130,246,.1)',
                          color: a.gender === 'female' ? '#ec4899' : '#3b82f6'
                        }}>
                        {a.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: a.status === 'active' ? 'rgba(34,197,94,.1)' : a.status === 'sold' ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)',
                          color: a.status === 'active' ? '#16a34a' : a.status === 'sold' ? '#d97706' : '#dc2626'
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{
                          background: a.status === 'active' ? '#22c55e' : a.status === 'sold' ? '#f59e0b' : '#ef4444'
                        }} />
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => edit(a)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ color: '#3b82f6' }}>
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(a.id)}
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
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Page {page} of {pages} · {total} total</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary p-2"><ChevronLeft size={16} /></button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="btn-secondary p-2"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}