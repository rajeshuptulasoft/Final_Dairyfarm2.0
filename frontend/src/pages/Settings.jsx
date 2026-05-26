import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Activity, Package2, Layers, Users, Truck, HeartPulse, ChevronRight } from 'lucide-react';
import ModalPortal from '../components/ui/ModalPortal';

const sectionTitles = {
  '/muktifarm/admin/settings': 'Settings Overview',
  '/muktifarm/admin/settings/items': 'Items',
  '/muktifarm/admin/settings/livestocks': 'Livestocks',
  '/muktifarm/admin/settings/products': 'Products',
  '/muktifarm/admin/settings/fodder': 'Fodder',
  '/muktifarm/admin/settings/buyers': 'Buyers',
  '/muktifarm/admin/settings/vendors': 'Vendors',
  '/muktifarm/admin/settings/doctors': 'Doctors',
};

const sections = [
  { key: 'items', label: 'Items', description: 'Manage item master data for the farm.', icon: Box },
  { key: 'livestocks', label: 'Livestocks', description: 'Track livestock categories and details.', icon: Activity },
  { key: 'products', label: 'Products', description: 'Configure products and service listings.', icon: Package2 },
  { key: 'fodder', label: 'Fodder', description: 'Manage fodder types and supply details.', icon: Layers },
  { key: 'buyers', label: 'Buyers', description: 'Manage buyer contacts and preferences.', icon: Users },
  { key: 'vendors', label: 'Vendors', description: 'Manage vendor contacts and supplies.', icon: Truck },
  { key: 'doctors', label: 'Doctors', description: 'Manage veterinary contacts and credentials.', icon: HeartPulse },
];

export default function Settings() {
  const location = useLocation();
  const title = useMemo(() => sectionTitles[location.pathname] || 'Settings', [location.pathname]);
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [showModal, setShowModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    itemName: '',
    isFodder: 'yes',
    itemType: 'Fodder',
    itemLife: '',
    itemLifeUnit: 'Minutes',
    showCount: '10',
    search: '',
  });
  const [livestockForm, setLivestockForm] = useState({
    livestockType: 'Animal',
    baseFodderItem: 'chokada',
    livestockGroupName: 'Cow',
    breed: '',
    milking: 'Yes',
    delivers: 'Calf',
    pregnancyDuration: '',
    pregnancyDurationSpan: 'Days',
    dailyFeedCount: '',
    feedTime01: '',
    feedTime02: '',
    feedTime03: '',
    feedTime04: '',
    feedTime05: '',
    dailyTotalNormalFeedQuantity: '',
    dailyTotalNormalFeedUnit: 'Kg',
    dailyTotalPregnantFeedQuantity: '',
    dailyTotalPregnantFeedUnit: 'Kg',
    dailyTotalCalfFeedQuantity: '',
    dailyTotalCalfFeedUnit: 'Kg',
    showCount: '10',
    search: '',
  });
  const [productForm, setProductForm] = useState({
    productName: '',
    skuUnit: 'bottle',
    mrp: '',
    category: 'Cheese',
    subCategory: 'default',
    productLife: '',
    productLifeUnit: 'Minutes',
    remarks: '',
    showCount: '10',
    search: '',
  });
  const [fodderForm, setFodderForm] = useState({
    baseFodderItem: 'chokada',
    exchangeFodderItem: 'chokada',
    baseFodderQuantity: '',
    exchangeFodderQuantity: '',
    unit: 'Kg',
    exchangeFodderUnit: 'Kg',
    showCount: '10',
    search: '',
  });
  const [buyersForm, setBuyersForm] = useState({
    buyerName: '',
    isOrganization: 'no',
    contactPerson: '',
    gstNo: '',
    maxCreditAmount: '',
    contactNo: '',
    altPhoneNo: '',
    email: '',
    buyerToPay: '',
    showCount: '10',
    search: '',
  });
  const [vendorForm, setVendorForm] = useState({
    vendorName: '',
    organizationName: '',
    gstNo: '',
    contactNo: '',
    email: '',
    maxCreditAmount: '',
    toPay: '',
    altPhoneNo: '',
    showCount: '10',
    search: '',
  });
  const [doctorForm, setDoctorForm] = useState({
    doctorName: '',
    costVisit: '',
    costHour: '',
    costOnline: '',
    contactNo: '',
    altPhoneNo: '',
    email: '',
    rating: '',
    address: '',
    showCount: '10',
    search: '',
  });

  const openSection = (section) => {
    setActiveSection(section);
    setShowModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (activeSection.key === 'items') {
      setItemForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'livestocks') {
      setLivestockForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'products') {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'fodder') {
      setFodderForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'buyers') {
      setBuyersForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'vendors') {
      setVendorForm((prev) => ({ ...prev, [name]: value }));
    } else if (activeSection.key === 'doctors') {
      setDoctorForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    setShowModal(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sections.length} sections available</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => openSection(section)}
              className="btn-secondary"
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <ModalPortal>
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-content"
              style={{ maxWidth: activeSection.key === 'livestocks' ? '900px' : '720px' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">Quick action</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{activeSection.label} settings</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-2xl font-semibold text-slate-400 transition hover:text-slate-600 dark:text-slate-300 dark:hover:text-white"
                  aria-label="Close popup"
                >
                  ×
                </button>
              </div>
              {activeSection.key === 'items' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Item Name:</label>
                      <input
                        type="text"
                        name="itemName"
                        value={itemForm.itemName}
                        onChange={handleFormChange}
                        placeholder="Enter item name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Is Fodder:</label>
                      <select
                        name="isFodder"
                        value={itemForm.isFodder}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Item Type:</label>
                      <select
                        name="itemType"
                        value={itemForm.itemType}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Fodder">Fodder</option>
                        <option value="Product">Product</option>
                        <option value="Supply">Supply</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Item Life:</label>
                      <input
                        type="text"
                        name="itemLife"
                        value={itemForm.itemLife}
                        onChange={handleFormChange}
                        placeholder="Enter item life"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Item Life Unit:</label>
                      <select
                        name="itemLifeUnit"
                        value={itemForm.itemLifeUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Minutes">Minutes</option>
                        <option value="Hours">Hours</option>
                        <option value="Days">Days</option>
                        <option value="Months">Months</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={itemForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={itemForm.search}
                        onChange={handleFormChange}
                        placeholder="Search items"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'livestocks' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Livestock Type:</label>
                      <select
                        name="livestockType"
                        value={livestockForm.livestockType}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Animal">Animal</option>
                        <option value="Poultry">Poultry</option>
                        <option value="Sheep">Sheep</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Base Fodder Item:</label>
                      <select
                        name="baseFodderItem"
                        value={livestockForm.baseFodderItem}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="chokada">chokada</option>
                        <option value="grass">grass</option>
                        <option value="hay">hay</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Livestock Group Name:</label>
                      <select
                        name="livestockGroupName"
                        value={livestockForm.livestockGroupName}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Cow">Cow</option>
                        <option value="Buffalo">Buffalo</option>
                        <option value="Goat">Goat</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Breed:</label>
                      <input
                        type="text"
                        name="breed"
                        value={livestockForm.breed}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter breed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Milking:</label>
                      <select
                        name="milking"
                        value={livestockForm.milking}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Delivers:</label>
                      <select
                        name="delivers"
                        value={livestockForm.delivers}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Calf">Calf</option>
                        <option value="Foal">Foal</option>
                        <option value="Kid">Kid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Pregnancy Duration:</label>
                      <input
                        type="text"
                        name="pregnancyDuration"
                        value={livestockForm.pregnancyDuration}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter duration"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Pregnancy Duration Span:</label>
                      <select
                        name="pregnancyDurationSpan"
                        value={livestockForm.pregnancyDurationSpan}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Days">Days</option>
                        <option value="Months">Months</option>
                        <option value="Weeks">Weeks</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Feed Count:</label>
                      <input
                        type="text"
                        name="dailyFeedCount"
                        value={livestockForm.dailyFeedCount}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter count"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Feed Time 01:</label>
                      <input
                        type="text"
                        name="feedTime01"
                        value={livestockForm.feedTime01}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter feed time"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Feed Time 02:</label>
                      <input
                        type="text"
                        name="feedTime02"
                        value={livestockForm.feedTime02}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter feed time"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Feed Time 03:</label>
                      <input
                        type="text"
                        name="feedTime03"
                        value={livestockForm.feedTime03}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter feed time"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Feed Time 04:</label>
                      <input
                        type="text"
                        name="feedTime04"
                        value={livestockForm.feedTime04}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter feed time"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Feed Time 05:</label>
                      <input
                        type="text"
                        name="feedTime05"
                        value={livestockForm.feedTime05}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter feed time"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Normal Feed Quantity:</label>
                      <input
                        type="text"
                        name="dailyTotalNormalFeedQuantity"
                        value={livestockForm.dailyTotalNormalFeedQuantity}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Normal Feed Unit:</label>
                      <select
                        name="dailyTotalNormalFeedUnit"
                        value={livestockForm.dailyTotalNormalFeedUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Kg">Kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Pregnant Feed Quantity:</label>
                      <input
                        type="text"
                        name="dailyTotalPregnantFeedQuantity"
                        value={livestockForm.dailyTotalPregnantFeedQuantity}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Pregnant Feed Unit:</label>
                      <select
                        name="dailyTotalPregnantFeedUnit"
                        value={livestockForm.dailyTotalPregnantFeedUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Kg">Kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Calf Feed Quantity:</label>
                      <input
                        type="text"
                        name="dailyTotalCalfFeedQuantity"
                        value={livestockForm.dailyTotalCalfFeedQuantity}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Total Calf Feed Unit:</label>
                      <select
                        name="dailyTotalCalfFeedUnit"
                        value={livestockForm.dailyTotalCalfFeedUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Kg">Kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={livestockForm.showCount}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={livestockForm.search}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Search livestocks"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'products' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Name:</label>
                      <input
                        type="text"
                        name="productName"
                        value={productForm.productName}
                        onChange={handleFormChange}
                        placeholder="Enter product name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Sub Category:</label>
                      <select
                        name="subCategory"
                        value={productForm.subCategory}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="default">default</option>
                        <option value="milk">milk</option>
                        <option value="cheese">cheese</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Stock Keeping Unit (SKU):</label>
                      <select
                        name="skuUnit"
                        value={productForm.skuUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="bottle">bottle</option>
                        <option value="ltr">ltr</option>
                        <option value="pack">pack</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">MRP:</label>
                      <input
                        type="text"
                        name="mrp"
                        value={productForm.mrp}
                        onChange={handleFormChange}
                        placeholder="Enter MRP"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Category:</label>
                      <select
                        name="category"
                        value={productForm.category}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Cheese">Cheese</option>
                        <option value="Milk">Milk</option>
                        <option value="Yogurt">Yogurt</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Life:</label>
                      <input
                        type="text"
                        name="productLife"
                        value={productForm.productLife}
                        onChange={handleFormChange}
                        placeholder="Enter product life"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Life Unit:</label>
                      <select
                        name="productLifeUnit"
                        value={productForm.productLifeUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Minutes">Minutes</option>
                        <option value="Hours">Hours</option>
                        <option value="Days">Days</option>
                      </select>
                    </div>
                    <div className="space-y-2 xl:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Remarks:</label>
                      <textarea
                        name="remarks"
                        value={productForm.remarks}
                        onChange={handleFormChange}
                        className="input-field"
                        rows={3}
                        placeholder="Enter remarks"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={productForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={productForm.search}
                        onChange={handleFormChange}
                        placeholder="Search products"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'buyers' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Buyer Name:</label>
                      <input
                        type="text"
                        name="buyerName"
                        value={buyersForm.buyerName}
                        onChange={handleFormChange}
                        placeholder="Enter buyer name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Contact No.:</label>
                      <input
                        type="text"
                        name="contactNo"
                        value={buyersForm.contactNo}
                        onChange={handleFormChange}
                        placeholder="Enter contact number"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Is An Organization ?:</label>
                      <select
                        name="isOrganization"
                        value={buyersForm.isOrganization}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="no">no</option>
                        <option value="yes">yes</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Alt. Phone No.:</label>
                      <input
                        type="text"
                        name="altPhoneNo"
                        value={buyersForm.altPhoneNo}
                        onChange={handleFormChange}
                        placeholder="Enter alternate phone"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Contact Person (If Any):</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={buyersForm.contactPerson}
                        onChange={handleFormChange}
                        placeholder="Enter contact person"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email Id:</label>
                      <input
                        type="email"
                        name="email"
                        value={buyersForm.email}
                        onChange={handleFormChange}
                        placeholder="Enter email"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">GST No.:</label>
                      <input
                        type="text"
                        name="gstNo"
                        value={buyersForm.gstNo}
                        onChange={handleFormChange}
                        placeholder="Enter GST number"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Buyer To Pay:</label>
                      <input
                        type="text"
                        name="buyerToPay"
                        value={buyersForm.buyerToPay}
                        onChange={handleFormChange}
                        placeholder="Enter amount to pay"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2 xl:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Max Credit Amount:</label>
                      <input
                        type="text"
                        name="maxCreditAmount"
                        value={buyersForm.maxCreditAmount}
                        onChange={handleFormChange}
                        placeholder="Enter max credit amount"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={buyersForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={buyersForm.search}
                        onChange={handleFormChange}
                        placeholder="Search buyers"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'vendors' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Vendor Name:</label>
                      <input
                        type="text"
                        name="vendorName"
                        value={vendorForm.vendorName}
                        onChange={handleFormChange}
                        placeholder="Enter vendor name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email Id:</label>
                      <input
                        type="email"
                        name="email"
                        value={vendorForm.email}
                        onChange={handleFormChange}
                        placeholder="Enter email"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Organization Name:</label>
                      <input
                        type="text"
                        name="organizationName"
                        value={vendorForm.organizationName}
                        onChange={handleFormChange}
                        placeholder="Enter organization name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Max Credit Amount:</label>
                      <input
                        type="text"
                        name="maxCreditAmount"
                        value={vendorForm.maxCreditAmount}
                        onChange={handleFormChange}
                        placeholder="Enter max credit amount"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">GST No.:</label>
                      <input
                        type="text"
                        name="gstNo"
                        value={vendorForm.gstNo}
                        onChange={handleFormChange}
                        placeholder="Enter GST number"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">To Pay:</label>
                      <input
                        type="text"
                        name="toPay"
                        value={vendorForm.toPay}
                        onChange={handleFormChange}
                        placeholder="Enter amount to pay"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Contact No.:</label>
                      <input
                        type="text"
                        name="contactNo"
                        value={vendorForm.contactNo}
                        onChange={handleFormChange}
                        placeholder="Enter contact number"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Alt Phone No. :</label>
                      <input
                        type="text"
                        name="altPhoneNo"
                        value={vendorForm.altPhoneNo}
                        onChange={handleFormChange}
                        placeholder="Enter alternate phone"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={vendorForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={vendorForm.search}
                        onChange={handleFormChange}
                        placeholder="Search vendors"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'doctors' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Doctor Name:</label>
                      <input
                        type="text"
                        name="doctorName"
                        value={doctorForm.doctorName}
                        onChange={handleFormChange}
                        placeholder="Enter doctor name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Alt Phone No. :</label>
                      <input
                        type="text"
                        name="altPhoneNo"
                        value={doctorForm.altPhoneNo}
                        onChange={handleFormChange}
                        placeholder="Enter alternate phone"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Cost/Visit :</label>
                      <input
                        type="text"
                        name="costVisit"
                        value={doctorForm.costVisit}
                        onChange={handleFormChange}
                        placeholder="Enter cost per visit"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email Id:</label>
                      <input
                        type="email"
                        name="email"
                        value={doctorForm.email}
                        onChange={handleFormChange}
                        placeholder="Enter email"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Cost/Hour:</label>
                      <input
                        type="text"
                        name="costHour"
                        value={doctorForm.costHour}
                        onChange={handleFormChange}
                        placeholder="Enter cost per hour"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Rating (1-5):</label>
                      <input
                        type="text"
                        name="rating"
                        value={doctorForm.rating}
                        onChange={handleFormChange}
                        placeholder="Enter rating"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Cost/Online:</label>
                      <input
                        type="text"
                        name="costOnline"
                        value={doctorForm.costOnline}
                        onChange={handleFormChange}
                        placeholder="Enter online consultation cost"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2 xl:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Address:</label>
                      <textarea
                        name="address"
                        value={doctorForm.address}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Enter address"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Contact No.:</label>
                      <input
                        type="text"
                        name="contactNo"
                        value={doctorForm.contactNo}
                        onChange={handleFormChange}
                        placeholder="Enter contact number"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={doctorForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={doctorForm.search}
                        onChange={handleFormChange}
                        placeholder="Search doctors"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : activeSection.key === 'fodder' ? (
                <form onSubmit={handleSave} className="mt-6 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Base Fodder Item:</label>
                      <select
                        name="baseFodderItem"
                        value={fodderForm.baseFodderItem}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="chokada">chokada</option>
                        <option value="grass">grass</option>
                        <option value="hay">hay</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Exchange Fodder Item:</label>
                      <select
                        name="exchangeFodderItem"
                        value={fodderForm.exchangeFodderItem}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="chokada">chokada</option>
                        <option value="grass">grass</option>
                        <option value="hay">hay</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Base Fodder Quantity:</label>
                      <input
                        type="text"
                        name="baseFodderQuantity"
                        value={fodderForm.baseFodderQuantity}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Quantity:</label>
                      <input
                        type="text"
                        name="exchangeFodderQuantity"
                        value={fodderForm.exchangeFodderQuantity}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Unit:</label>
                      <select
                        name="unit"
                        value={fodderForm.unit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Kg">Kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Exchange Fodder Unit:</label>
                      <select
                        name="exchangeFodderUnit"
                        value={fodderForm.exchangeFodderUnit}
                        onChange={handleFormChange}
                        className="input-field"
                      >
                        <option value="Kg">Kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Show</label>
                      <select
                        name="showCount"
                        value={fodderForm.showCount}
                        onChange={handleFormChange}
                        className="input-field w-full"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Search:</label>
                      <input
                        type="text"
                        name="search"
                        value={fodderForm.search}
                        onChange={handleFormChange}
                        className="input-field"
                        placeholder="Search fodder"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{activeSection.description} Use this popup to continue to the settings workflow or close it to return to the sections overview.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-primary w-full">Continue</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary w-full">Close</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
        </ModalPortal>
      )}
    </motion.div>
  );
}
