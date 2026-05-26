import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animalsAPI } from '../services/api';
import { Search, X, Beef, List, Edit2, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimalRegisterModal from '../components/animals/AnimalRegisterModal';
import { BREED_OPTIONS } from '../components/animals/AnimalRegisterFormFields';
import { initialAnimalForm, animalFromRecord, submitAnimal } from '../utils/animalForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

export default function RegisterAnimal() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialAnimalForm);
  const [editForm, setEditForm] = useState(initialAnimalForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    animalsAPI.list({}).then(res => setAnimals(res.data.animals || [])).catch(() => {});
  }, []);

  const refreshList = async () => {
    const res = await animalsAPI.list({});
    setAnimals(res.data.animals || []);
  };

  const clearRegisterImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image_url: '' }));
  };

  const clearEditImage = () => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(null);
    setEditImagePreview('');
    setEditForm((prev) => ({ ...prev, image_url: '' }));
  };

  const handleRegisterImage = (file) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEditImage = (file) => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await submitAnimal({ form, imageFile });
      console.log('Animal register success');
      toast.success('Animal registered');
      setForm(initialAnimalForm);
      clearRegisterImage();
      setShowRegisterModal(false);
      await refreshList();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error registering';
      console.log('Animal register error:', msg);
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await submitAnimal({ form: editForm, imageFile: editImageFile, editingId: editId });
      console.log('Animal update success');
      toast.success('Animal updated');
      setShowEditModal(false);
      setEditId(null);
      clearEditImage();
      await refreshList();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error updating';
      console.log('Animal update error:', msg);
      toast.error(msg);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this animal?')) return;
    try { await animalsAPI.delete(id); toast.success('Deleted'); await refreshList(); }
    catch { toast.error('Error deleting'); }
  };

  const openEdit = (a) => {
    clearEditImage();
    setEditForm(animalFromRecord(a));
    setEditId(a.id);
    setShowEditModal(true);
  };

  const filtered = animals.filter((a) => {
    const matchesSearch =
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.tag_number?.toLowerCase().includes(search.toLowerCase());
    const matchesBreed = !breedFilter || a.breed === breedFilter;
    return matchesSearch && matchesBreed;
  });

  const fields = [
    { key: 'tag_number', label: 'Tag *' },
    { key: 'name', label: 'Name *' },
    { key: 'breed', label: 'Breed *' },
    { key: 'animal_type', label: 'Type' },
    { key: 'gender', label: 'Gender' },
    { key: 'color', label: 'Color' },
    { key: 'weight', label: 'Wt(kg)' },
    { key: 'date_of_birth', label: 'DOB' },
    { key: 'farm_entry_date', label: 'Farm Entry' },
    { key: 'purchase_price', label: 'Price(₹)' },
    { key: 'milking_now', label: 'Milking' },
    { key: 'is_calf', label: 'Calf' },
    { key: 'status', label: 'Status' },
    { key: 'remarks', label: 'Remarks' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/muktifarm/admin/animals')} className="p-2 rounded-xl hover:bg-black/[.04] dark:hover:bg-white/[.04] transition-all" style={{ color: 'var(--text-soft)' }}>
            <List size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Register Animal</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add new animals or manage existing</p>
          </div>
        </div>
        {/* <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setForm(initialAnimalForm);
            clearRegisterImage();
            setShowRegisterModal(true);
          }}
        >
          <Plus size={16} />
          Register
        </button> */}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }} />
          <input className="input-field pl-9" placeholder="Search name or tag..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-soft)' }}>
              <X size={14} />
            </button>
          )}
        </div>
        <select className="input-field w-auto" value={breedFilter} onChange={e => setBreedFilter(e.target.value)}>
          <option value="">All Breeds</option>
          {BREED_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        {/* <button
          type="button"
          className="btn-primary flex items-center gap-2 shrink-0"
          onClick={() => {
            setForm(initialAnimalForm);
            clearRegisterImage();
            setShowRegisterModal(true);
          }}
        >
          <Plus size={16} />
          Register
        </button> */}
      </div>

      <AdminTablePanel noPadding>
          <table className="w-full admin-data-table">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {fields.map(f => (
                  <th key={f.key} className="text-left px-3 py-3 whitespace-nowrap">{f.label.replace(' *', '')}</th>
                ))}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={fields.length + 1} className="text-center py-16" style={{ color: 'var(--text-soft)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,.08)', color: 'var(--primary)' }}>
                      <Beef size={28} />
                    </div>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>{search || breedFilter ? 'No matches found' : 'No animals yet'}</p>
                    {/* <button type="button" className="btn-primary mt-2" onClick={() => { setForm(initialAnimalForm); clearRegisterImage(); setShowRegisterModal(true); }}>
                      <Plus size={14} /> Register Animal
                    </button> */}
                  </div>
                </td></tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id}
                    className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}>
                    {fields.map(f => {
                      const val = f.key === 'farm_entry_date'
                        ? (a.farm_entry_date || a.purchase_date || '-')
                        : (a[f.key] ?? '-');
                      if (f.key === 'gender') {
                        return (
                          <td key={f.key} className="px-3 py-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                              style={{
                                background: a.gender === 'female' ? 'rgba(236,72,153,.1)' : 'rgba(59,130,246,.1)',
                                color: a.gender === 'female' ? '#ec4899' : '#3b82f6'
                              }}>
                              {a.gender}
                            </span>
                          </td>
                        );
                      }
                      if (f.key === 'status') {
                        return (
                          <td key={f.key} className="px-3 py-3">
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
                        );
                      }
                      if (f.key === 'name') {
                        return (
                          <td key={f.key} className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,.12)', color: '#d97706' }}>
                                <Beef size={16} />
                              </div>
                              <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{a.name}</span>
                            </div>
                          </td>
                        );
                      }
                      if (f.key === 'tag_number') {
                        return (
                          <td key={f.key} className="px-3 py-3">
                            <span className="font-mono text-sm font-medium" style={{ color: 'var(--text-soft)' }}>#{a.tag_number}</span>
                          </td>
                        );
                      }
                      return (
                        <td key={f.key} className="px-3 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{val}</td>
                      );
                    })}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(a)}
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
      </AdminTablePanel>

      {showRegisterModal && (
        <AnimalRegisterModal
          title="Register"
          form={form}
          setForm={setForm}
          onSubmit={handleRegister}
          onClose={() => {
            setShowRegisterModal(false);
            setForm(initialAnimalForm);
            clearRegisterImage();
          }}
          submitLabel="Register"
          saving={saving}
          imagePreview={imagePreview}
          onImageSelect={handleRegisterImage}
          onImageClear={clearRegisterImage}
        />
      )}

      {showEditModal && (
        <AnimalRegisterModal
          title="Edit Animal"
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setEditId(null);
            clearEditImage();
          }}
          submitLabel="Update"
          saving={saving}
          imagePreview={editImagePreview}
          onImageSelect={handleEditImage}
          onImageClear={clearEditImage}
        />
      )}
    </motion.div>
  );
}
