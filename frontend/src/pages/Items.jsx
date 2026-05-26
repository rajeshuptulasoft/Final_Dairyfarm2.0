import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Search, Edit2, Trash2, Box, Tag, Activity, Package2, Layers, Users, Truck, HeartPulse, ShoppingCart, Beef, User, Phone, Heart, Star } from 'lucide-react';
import { itemsAPI, livestockAPI, buyersAPI, vendorsAPI, doctorsAPI } from '../services/api';
import toast from 'react-hot-toast';
import AdminModal from '../components/ui/AdminModal';
import ItemFormFields from '../components/items/ItemFormFields';
import LivestockFormFields from '../components/livestock/LivestockFormFields';
import BuyerFormFields from '../components/buyers/BuyerFormFields';
import { getInitialBuyerForm, buildBuyerPayload, buyerFromRecord } from '../utils/buyerForm';
import VendorFormFields from '../components/vendors/VendorFormFields';
import { getInitialVendorForm, buildVendorPayload, vendorFromRecord } from '../utils/vendorForm';
import DoctorFormFields from '../components/doctors/DoctorFormFields';
import { getInitialDoctorForm, buildDoctorPayload, doctorFromRecord } from '../utils/doctorForm';
import { getInitialItemForm, buildItemPayload, itemFromRecord } from '../utils/itemForm';
import {
  getInitialLivestockForm,
  buildLivestockPayload,
  livestockFromRecord,
} from '../utils/livestockForm';
import AdminTablePanel from '../components/layout/AdminTablePanel';

const settingSections = [
  { key: 'items', label: 'Items', icon: Box, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  { key: 'livestocks', label: 'Livestocks', icon: Activity, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { key: 'products', label: 'Products', icon: Package2, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { key: 'fodder', label: 'Fodder', icon: Layers, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  { key: 'buyers', label: 'Buyers', icon: Users, gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
  { key: 'vendors', label: 'Vendors', icon: Truck, gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  { key: 'doctors', label: 'Doctors', icon: HeartPulse, gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
];

const sectionForms = {
  items: getInitialItemForm(),
  livestocks: getInitialLivestockForm(),
  products: { product_name: '', sku_unit: 'bottle', mrp: '', category: 'Cheese', sub_category: 'default', product_life: '', product_life_unit: 'Minutes', remarks: '' },
  fodder: { base_fodder: 'chokada', exchange_fodder: 'chokada', base_qty: '', exchange_qty: '', unit: 'Kg', exchange_unit: 'Kg' },
  buyers: getInitialBuyerForm(),
  vendors: getInitialVendorForm(),
  doctors: getInitialDoctorForm(),
};

const sectionTitles = {
  items: 'Manage item master data', livestocks: 'Manage livestock categories',
  products: 'Manage product listings', fodder: 'Manage fodder types',
  buyers: 'Manage buyer contacts', vendors: 'Manage vendor contacts',
  doctors: 'Manage veterinary contacts',
};

const FIELDS = [
  { key: 'item_name', label: 'Item Name' }, { key: 'is_fodder', label: 'Is Fodder' },
  { key: 'item_type', label: 'Item Type' }, { key: 'item_life', label: 'Item Life' },
  { key: 'item_life_unit', label: 'Life Unit' },
];

const selectFields = ['is_fodder','item_type','item_life_unit','livestock_type','group_name','milking','delivers','pregnancy_span','unit','exchange_unit','daily_normal_feed_unit','daily_pregnant_feed_unit','daily_calf_feed_unit','is_organization','sku_unit','category','sub_category','product_life_unit','base_fodder','exchange_fodder'];

const buyerTableKeys = [
  'buyer_name', 'contact_person', 'contact_no', 'gst_no', 'is_organization', 'max_credit', 'buyer_to_pay',
];

const vendorTableKeys = [
  'vendor_name', 'organization', 'contact_no', 'gst_no', 'max_credit', 'to_pay',
];

const doctorTableKeys = [
  'doctor_name', 'email', 'contact_no', 'cost_visit', 'cost_hour', 'cost_online', 'rating',
];

const livestockTableKeys = [
  'livestock_type', 'group_name', 'breed', 'milking', 'delivers', 'base_fodder_name',
  'pregnancy_duration', 'pregnancy_span', 'daily_feed_count',
  'feed_time_01', 'feed_time_02', 'daily_normal_feed_qty', 'daily_pregnant_feed_qty', 'daily_calf_feed_qty',
];

const SectionModal = ({ section, form, setForm, onSave, onClose, open = true, titlePrefix = 'New', saving = false, fodderItems = [] }) => (
  <AdminModal
    open={open}
    onClose={onClose}
    title={`${titlePrefix} ${settingSections.find((s) => s.key === section)?.label}`}
    maxWidth={section === 'livestocks' ? '900px' : '720px'}
  >
        <form onSubmit={onSave}>
          {section === 'items' ? (
            <ItemFormFields form={form} setForm={setForm} />
          ) : section === 'livestocks' ? (
            <LivestockFormFields form={form} setForm={setForm} items={fodderItems} />
          ) : section === 'buyers' ? (
            <BuyerFormFields form={form} setForm={setForm} />
          ) : section === 'vendors' ? (
            <VendorFormFields form={form} setForm={setForm} />
          ) : section === 'doctors' ? (
            <DoctorFormFields form={form} setForm={setForm} />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(sectionForms[section]).map(fkey => {
              const val = form[fkey] !== undefined ? form[fkey] : '';
              const setVal = (v) => setForm(prev => ({...prev, [fkey]: v}));
              if (selectFields.includes(fkey)) {
                return (
                  <div key={fkey}>
                    <label className="block text-xs font-medium mb-1 capitalize" style={{color:'var(--text-muted)'}}>{fkey.replace(/_/g,' ')}</label>
                    <select className="input-field text-sm" value={val} onChange={e=>setVal(e.target.value)}>
                      {fkey==='is_fodder'&&<><option value="yes">Yes</option><option value="no">No</option></>}
                      {fkey==='item_type'&&<><option value="Fodder">Fodder</option><option value="Product">Product</option><option value="Supply">Supply</option></>}
                      {fkey==='item_life_unit'&&<><option value="Minutes">Minutes</option><option value="Hours">Hours</option><option value="Days">Days</option><option value="Months">Months</option></>}
                      {fkey==='livestock_type'&&<><option value="Animal">Animal</option><option value="Poultry">Poultry</option><option value="Sheep">Sheep</option></>}
                      {fkey==='group_name'&&<><option value="Cow">Cow</option><option value="Buffalo">Buffalo</option><option value="Goat">Goat</option></>}
                      {fkey==='milking'&&<><option value="Yes">Yes</option><option value="No">No</option></>}
                      {fkey==='delivers'&&<><option value="Calf">Calf</option><option value="Foal">Foal</option><option value="Kid">Kid</option></>}
                      {fkey==='pregnancy_span'&&<><option value="Days">Days</option><option value="Months">Months</option><option value="Years">Years</option></>}
                      {(fkey==='unit'||fkey==='exchange_unit'||fkey==='daily_normal_feed_unit'||fkey==='daily_pregnant_feed_unit'||fkey==='daily_calf_feed_unit')&&<><option value="Kg">Kg</option><option value="L">L</option></>}
                      {fkey==='is_organization'&&<><option value="no">No</option><option value="yes">Yes</option></>}
                      {fkey==='sku_unit'&&<><option value="bottle">Bottle</option><option value="ltr">Ltr</option><option value="pack">Pack</option></>}
                      {fkey==='category'&&<><option value="Cheese">Cheese</option><option value="Milk">Milk</option><option value="Yogurt">Yogurt</option></>}
                      {fkey==='sub_category'&&<><option value="default">Default</option><option value="milk">Milk</option><option value="cheese">Cheese</option></>}
                      {fkey==='product_life_unit'&&<><option value="Minutes">Minutes</option><option value="Hours">Hours</option><option value="Days">Days</option></>}
                      {(fkey==='base_fodder'||fkey==='exchange_fodder')&&<><option value="chokada">Chokada</option><option value="grass">Grass</option><option value="hay">Hay</option></>}
                    </select>
                  </div>
                );
              }
              if (fkey==='address'||fkey==='remarks') {
                return <div key={fkey} className="sm:col-span-2"><label className="block text-xs font-medium mb-1 capitalize" style={{color:'var(--text-muted)'}}>{fkey.replace(/_/g,' ')}</label><textarea className="input-field text-sm" rows={3} value={val} onChange={e=>setVal(e.target.value)} placeholder={`Enter ${fkey.replace(/_/g,' ')}`} /></div>;
              }
              return (
                <div key={fkey}>
                  <label className="block text-xs font-medium mb-1 capitalize" style={{color:'var(--text-muted)'}}>{fkey.replace(/_/g,' ')}</label>
                  {fkey.startsWith('feed_time') ? (
                    <input className="input-field text-sm" type="time" value={val} onChange={e=>setVal(e.target.value)} />
                  ) : (
                    <input className="input-field text-sm" value={val} onChange={e=>setVal(e.target.value)} placeholder={`Enter ${fkey.replace(/_/g,' ')}`} />
                  )}
                </div>
              );
            })}
          </div>
          )}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{borderColor:'var(--border)'}}>
            <button type="submit" disabled={saving && ['items', 'livestocks', 'buyers', 'vendors', 'doctors'].includes(section)} className="btn-primary flex items-center gap-2">
              {saving && ['items', 'livestocks', 'buyers', 'vendors', 'doctors'].includes(section) ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save size={18} />
              )}
              {saving && ['items', 'livestocks', 'buyers', 'vendors', 'doctors'].includes(section) ? 'Saving...' : ['items', 'buyers', 'vendors', 'doctors'].includes(section) ? 'Register' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
  </AdminModal>
);

export default function Items() {
  const [activeSection, setActiveSection] = useState('items');
  const [records, setRecords] = useState({});
  const [forms, setForms] = useState({});
  const [editForms, setEditForms] = useState({});
  const [editIds, setEditIds] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [search, setSearch] = useState('');

  const initAllForms = {};
  Object.keys(sectionForms).forEach((k) => {
    initAllForms[k] = k === 'items'
      ? getInitialItemForm()
      : k === 'livestocks'
        ? getInitialLivestockForm()
        : k === 'buyers'
          ? getInitialBuyerForm()
          : k === 'vendors'
            ? getInitialVendorForm()
            : k === 'doctors'
              ? getInitialDoctorForm()
              : { ...sectionForms[k] };
  });
  const [localForms, setLocalForms] = useState(initAllForms);
  const [saving, setSaving] = useState(false);
  const [fodderItems, setFodderItems] = useState([]);

  const load = async () => {
    try {
      const [itemsRes, livestockRes, buyersRes, vendorsRes, doctorsRes] = await Promise.all([
        itemsAPI.list({ limit: 200 }),
        livestockAPI.list({ limit: 200 }).catch(() => ({ data: { records: [] } })),
        buyersAPI.list({ limit: 200 }).catch(() => ({ data: { records: [] } })),
        vendorsAPI.list({ limit: 200 }).catch(() => ({ data: { records: [] } })),
        doctorsAPI.list({ limit: 200 }).catch(() => ({ data: { records: [] } })),
      ]);
      const itemList = itemsRes.data?.records || itemsRes.data?.items || [];
      setFodderItems(itemList);
      setRecords((prev) => ({
        ...prev,
        items: itemList,
        livestocks: livestockRes.data?.records || [],
        buyers: buyersRes.data?.records || [],
        vendors: vendorsRes.data?.records || [],
        doctors: doctorsRes.data?.records || [],
      }));
    } catch {
      setFodderItems([]);
      setRecords((prev) => ({
        ...prev,
        items: [],
        livestocks: [],
        buyers: prev.buyers || [],
        vendors: prev.vendors || [],
        doctors: prev.doctors || [],
      }));
    }
  };

  useEffect(() => {
    load();
    Object.keys(sectionForms).forEach((k) => {
      if (k !== 'items' && k !== 'livestocks' && k !== 'buyers' && k !== 'vendors' && k !== 'doctors' && !records[k]) {
        setRecords((prev) => ({ ...prev, [k]: [] }));
      }
    });
  }, []);

  const apiErrorMessage = (err, fallback) =>
    err.response?.data?.error ||
    (Array.isArray(err.response?.data?.errors)
      ? err.response.data.errors.join(', ')
      : err.response?.data?.errors) ||
    fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const key = activeSection;
    const form = localForms[key];
    if (key === 'items') {
      setSaving(true);
      try {
        const payload = buildItemPayload(form);
        const res = await itemsAPI.create(payload);
        toast.success(res.data?.message || 'Item created');
        setShowForm(false);
        setLocalForms((prev) => ({ ...prev, [key]: getInitialItemForm() }));
        await load();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error saving item'));
      }
      setSaving(false);
      return;
    }
    if (key === 'livestocks') {
      setSaving(true);
      try {
        const res = await livestockAPI.create(buildLivestockPayload(form, fodderItems));
        toast.success(res.data?.message || 'Livestock saved');
        setShowForm(false);
        setLocalForms((prev) => ({ ...prev, [key]: getInitialLivestockForm() }));
        await load();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error saving livestock'));
      }
      setSaving(false);
      return;
    }
    if (key === 'buyers') {
      setSaving(true);
      try {
        const res = await buyersAPI.create(buildBuyerPayload(form));
        const created = res.data?.record;
        if (created?.id) {
          setRecords((prev) => ({
            ...prev,
            buyers: [created, ...(prev.buyers || []).filter((r) => r.id !== created.id)],
          }));
        }
        toast.success(res.data?.message || 'Buyer saved');
        setShowForm(false);
        setLocalForms((prev) => ({ ...prev, [key]: getInitialBuyerForm() }));
        const buyersRes = await buyersAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, buyers: buyersRes.data?.records || prev.buyers || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error saving buyer'));
      }
      setSaving(false);
      return;
    }
    if (key === 'vendors') {
      setSaving(true);
      try {
        const res = await vendorsAPI.create(buildVendorPayload(form));
        const created = res.data?.record;
        if (created?.id) {
          setRecords((prev) => ({
            ...prev,
            vendors: [created, ...(prev.vendors || []).filter((r) => r.id !== created.id)],
          }));
        }
        toast.success(res.data?.message || 'Vendor saved');
        setShowForm(false);
        setLocalForms((prev) => ({ ...prev, [key]: getInitialVendorForm() }));
        const vendorsRes = await vendorsAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, vendors: vendorsRes.data?.records || prev.vendors || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error saving vendor'));
      }
      setSaving(false);
      return;
    }
    if (key === 'doctors') {
      setSaving(true);
      try {
        const res = await doctorsAPI.create(buildDoctorPayload(form));
        const created = res.data?.record;
        if (created?.id) {
          setRecords((prev) => ({
            ...prev,
            doctors: [created, ...(prev.doctors || []).filter((r) => r.id !== created.id)],
          }));
        }
        toast.success(res.data?.message || 'Doctor saved');
        setShowForm(false);
        setLocalForms((prev) => ({ ...prev, [key]: getInitialDoctorForm() }));
        const doctorsRes = await doctorsAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, doctors: doctorsRes.data?.records || prev.doctors || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error saving doctor'));
      }
      setSaving(false);
      return;
    }
    const rec = { id: Date.now(), ...form };
    setRecords((prev) => ({ ...prev, [key]: [rec, ...(prev[key] || [])] }));
    toast.success('Saved');
    setShowForm(false);
    setLocalForms((prev) => ({ ...prev, [key]: { ...sectionForms[key] } }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const key = editSection;
    const form = editForms[key];
    const id = editIds[key];
    if (key === 'items') {
      setSaving(true);
      try {
        const payload = buildItemPayload(form, { forUpdate: true });
        const res = await itemsAPI.update(id, payload);
        toast.success(res.data?.message || 'Item updated');
        setShowEdit(false);
        setEditSection(null);
        await load();
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error updating item');
      }
      setSaving(false);
      return;
    }
    if (key === 'livestocks') {
      setSaving(true);
      try {
        const res = await livestockAPI.update(id, buildLivestockPayload(form, fodderItems));
        toast.success(res.data?.message || 'Livestock updated');
        setShowEdit(false);
        setEditSection(null);
        await load();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error updating livestock'));
      }
      setSaving(false);
      return;
    }
    if (key === 'buyers') {
      setSaving(true);
      try {
        const res = await buyersAPI.update(id, buildBuyerPayload(form));
        toast.success(res.data?.message || 'Buyer updated');
        setShowEdit(false);
        setEditSection(null);
        const buyersRes = await buyersAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, buyers: buyersRes.data?.records || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error updating buyer'));
      }
      setSaving(false);
      return;
    }
    if (key === 'vendors') {
      setSaving(true);
      try {
        const res = await vendorsAPI.update(id, buildVendorPayload(form));
        toast.success(res.data?.message || 'Vendor updated');
        setShowEdit(false);
        setEditSection(null);
        const vendorsRes = await vendorsAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, vendors: vendorsRes.data?.records || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error updating vendor'));
      }
      setSaving(false);
      return;
    }
    if (key === 'doctors') {
      setSaving(true);
      try {
        const res = await doctorsAPI.update(id, buildDoctorPayload(form));
        toast.success(res.data?.message || 'Doctor updated');
        setShowEdit(false);
        setEditSection(null);
        const doctorsRes = await doctorsAPI.list({ limit: 200 });
        setRecords((prev) => ({ ...prev, doctors: doctorsRes.data?.records || [] }));
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Error updating doctor'));
      }
      setSaving(false);
      return;
    }
    setRecords((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((r) => (r.id === id ? { ...r, ...form } : r)),
    }));
    toast.success('Updated');
    setShowEdit(false);
    setEditSection(null);
  };

  const handleDelete = (key, id) => {
    if (!confirm('Delete this record?')) return;
    if (key === 'items') {
      itemsAPI.delete(id).then(() => { toast.success('Deleted'); return load(); }).catch(() => toast.error('Error deleting'));
      return;
    }
    if (key === 'livestocks') {
      livestockAPI.delete(id).then(() => { toast.success('Deleted'); return load(); }).catch(() => toast.error('Error deleting'));
      return;
    }
    if (key === 'buyers') {
      buyersAPI.delete(id).then(() => { toast.success('Deleted'); return load(); }).catch(() => toast.error('Error deleting'));
      return;
    }
    if (key === 'vendors') {
      vendorsAPI.delete(id).then(() => { toast.success('Deleted'); return load(); }).catch(() => toast.error('Error deleting'));
      return;
    }
    if (key === 'doctors') {
      doctorsAPI.delete(id).then(() => { toast.success('Deleted'); return load(); }).catch(() => toast.error('Error deleting'));
      return;
    }
    setRecords((prev) => ({ ...prev, [key]: (prev[key] || []).filter((r) => r.id !== id) }));
    toast.success('Deleted');
  };

  const openEdit = (key, r) => {
    setEditSection(key);
    const filled = key === 'items'
      ? itemFromRecord(r)
      : key === 'livestocks'
        ? livestockFromRecord(r)
        : key === 'buyers'
          ? buyerFromRecord(r)
          : key === 'vendors'
            ? vendorFromRecord(r)
            : key === 'doctors'
              ? doctorFromRecord(r)
              : (() => {
            const o = {};
            Object.keys(sectionForms[key]).forEach((k) => {
              o[k] = r[k] !== undefined ? r[k] : sectionForms[key][k];
            });
            return o;
          })();
    setEditForms(prev => ({...prev, [key]: filled}));
    setEditIds(prev => ({...prev, [key]: r.id}));
    setShowEdit(true);
  };

  const openAdd = (key) => {
    setActiveSection(key);
    setSearch('');
    setShowEdit(false);
    setLocalForms((prev) => ({
      ...prev,
      [key]: key === 'items' ? getInitialItemForm() : key === 'livestocks' ? getInitialLivestockForm() : key === 'buyers' ? getInitialBuyerForm() : key === 'vendors' ? getInitialVendorForm() : key === 'doctors' ? getInitialDoctorForm() : { ...sectionForms[key] },
    }));
    setShowForm(true);
  };

  const sec = settingSections.find(s => s.key === activeSection) || settingSections[0];
  const secIcon = sec.icon;
  const secLabel = sec.label;
  const secDesc = sectionTitles[activeSection] || '';
  const recs = records[activeSection] || [];
  const formKeys = activeSection === 'livestocks'
    ? livestockTableKeys
    : activeSection === 'buyers'
      ? buyerTableKeys
      : activeSection === 'vendors'
        ? vendorTableKeys
        : activeSection === 'doctors'
          ? doctorTableKeys
          : Object.keys(sectionForms[activeSection]);
  const filtered = recs.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return formKeys.some(k => String(r[k] || '').toLowerCase().includes(q));
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'rgba(59,130,246,.12)',color:'#3b82f6'}}>
            <Box size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{color:'var(--text)'}}>{secLabel}</h1>
            <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>{secDesc}</p>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'var(--text-soft)'}} />
          <input className="input-field pl-9" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:'var(--text-soft)'}}><X size={14} /></button>}
        </div>
      </div>

      {/* Section Buttons — click opens modal with all fields */}
      <div className="flex flex-wrap gap-3">
        {settingSections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.key;
          return (
            <motion.button key={s.key} whileHover={{y:-2,boxShadow:'0 8px 25px rgba(0,0,0,0.15)'}} whileTap={{scale:0.96}}
              onClick={() => openAdd(s.key)}
              style={{
                background: s.gradient, border: isActive ? '2px solid rgba(255,255,255,0.5)' : 'none',
                borderRadius: 12, padding: '12px 22px',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontFamily: 'inherit',
              }}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.2)'}}>
                <Icon size={16} />
              </div>
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:14,fontWeight:600,letterSpacing:'0.01em'}}>{s.label}</div>
                <div style={{fontSize:11,opacity:0.75,marginTop:1}}>Add {s.label.toLowerCase()}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Premium Table */}
      <AdminTablePanel noPadding>
          <table className="w-full admin-data-table">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider" style={{background:'var(--surface-2)',color:'var(--text-muted)'}}>
                {formKeys.map(k => <th key={k} className="text-left px-3 py-3 whitespace-nowrap">{k.replace(/_/g,' ')}</th>)}
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={formKeys.length + 1} className="text-center py-16" style={{color:'var(--text-soft)'}}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{background:'rgba(59,130,246,.08)',color:'#3b82f6'}}><Box size={28} /></div>
                    <p className="font-semibold text-base" style={{color:'var(--text)'}}>{search ? 'No matches found' : `No ${secLabel.toLowerCase()} yet`}</p>
                    <p className="text-sm">Add your first {secLabel.toLowerCase()} using the button above</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id || i} className="border-t transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]" style={{borderColor:'var(--border)'}}>
                    {formKeys.map(k => (
                      <td key={k} className="px-3 py-3 text-sm whitespace-nowrap" style={{color:'var(--text-muted)'}}>
                        {(['item_name','product_name','vendor_name','doctor_name','buyer_name','group_name'].includes(k) || k==='base_fodder' || k==='base_fodder_name') ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'rgba(59,130,246,.12)',color:'#3b82f6'}}>
                              {k==='item_name'&&<Tag size={16}/>}{k==='product_name'&&<ShoppingCart size={16}/>}{k==='vendor_name'&&<Truck size={16}/>}{k==='doctor_name'&&<Heart size={16}/>}{k==='buyer_name'&&<User size={16}/>}{k==='group_name'&&<Beef size={16}/>}{(k==='base_fodder'||k==='base_fodder_name')&&<Layers size={16}/>}
                            </div>
                            <span className="font-medium text-sm" style={{color:'var(--text)'}}>{r[k]||'-'}</span>
                          </div>
                        ) : ['is_fodder','milking','is_organization','paid'].includes(k) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                            style={{background:String(r[k]||'yes')==='yes'||String(r[k])==='Yes'?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',color:String(r[k]||'yes')==='yes'||String(r[k])==='Yes'?'#16a34a':'#dc2626'}}>
                            {r[k]||'yes'}
                          </span>
                        ) : ['item_type','livestock_type','category','delivers'].includes(k) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{background:'rgba(59,130,246,.1)',color:'#2563eb'}}>{r[k]||'-'}</span>
                        ) : k==='rating' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{background:'rgba(251,191,36,.1)',color:'#d97706'}}><Star size={12}/>{r[k]||'-'}</span>
                        ) : ['contact_no','alt_phone'].includes(k) ? (
                          <span className="flex items-center gap-1"><Phone size={12} style={{color:'var(--text-soft)'}}/>{r[k]||'-'}</span>
                        ) : ['mrp','cost_visit','cost_hour','cost_online','max_credit','buyer_to_pay','to_pay'].includes(k) ? (
                          <span className="font-semibold" style={{color:'var(--text)'}}>₹{r[k]||'-'}</span>
                        ) : (r[k]||'-')}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                          onClick={()=>openEdit(activeSection,r)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{color:'#3b82f6'}}>
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                          onClick={()=>handleDelete(activeSection,r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" style={{color:'#ef4444'}}>
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

      {/* Section Modal */}
      {showForm && (
        <SectionModal section={activeSection} form={localForms[activeSection]} setForm={(updater)=>setLocalForms(prev=>({...prev, [activeSection]: typeof updater === 'function' ? updater(prev[activeSection]) : updater}))} onSave={handleSubmit} onClose={()=>setShowForm(false)} saving={saving} fodderItems={fodderItems} />
      )}

      {/* Edit Modal */}
      {showEdit && editSection && (
        <SectionModal section={editSection} titlePrefix="Edit" form={editForms[editSection]} setForm={(updater)=>setEditForms(prev=>({...prev, [editSection]: typeof updater === 'function' ? updater(prev[editSection]) : updater}))} onSave={handleUpdate} onClose={()=>{setShowEdit(false);setEditSection(null);}} saving={saving} fodderItems={fodderItems} />
      )}
    </motion.div>
  );
}
