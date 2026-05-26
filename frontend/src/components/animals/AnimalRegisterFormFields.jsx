export const BREED_OPTIONS = ['GIR', 'JERSEY', 'SAHIWAL', 'DESI'];
export const ANIMAL_TYPE_OPTIONS = ['Cow', 'Goat'];
export const HEALTH_STATUS_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'sick', label: 'Sick' },
  { value: 'recovering', label: 'Recovering' },
  { value: 'critical', label: 'Critical' },
];
export const PREGNANCY_STATUS_OPTIONS = [
  { value: 'not_pregnant', label: 'Not Pregnant' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'lactating', label: 'Lactating' },
  { value: 'dry', label: 'Dry' },
];

export default function AnimalRegisterFormFields({
  form,
  setForm,
  errors = {},
  imagePreview = '',
  onImageSelect,
  onImageClear,
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter name"
            required
          />
          {errors.name && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.name}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tag Number *</label>
          <input
            className="input-field"
            value={form.tag_number}
            onChange={(e) => setForm({ ...form, tag_number: e.target.value })}
            placeholder="e.g. A-001"
            required
          />
          {errors.tag_number && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.tag_number}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Breed *</label>
          <select
            className="input-field"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            required
          >
            <option value="">-- Select Breed --</option>
            {form.breed && !BREED_OPTIONS.includes(form.breed) && (
              <option value={form.breed}>{form.breed}</option>
            )}
            {BREED_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.breed && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.breed}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            className="input-field"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            className="input-field"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Farm Entry Date</label>
          <input
            type="date"
            className="input-field"
            value={form.farm_entry_date}
            onChange={(e) => setForm({ ...form, farm_entry_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="input-field"
            value={form.purchase_price}
            onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="input-field"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="dead">Dead</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (Kg)</label>
          <input
            type="number"
            className="input-field"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <input
            className="input-field"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Animal Type</label>
          <select
            className="input-field"
            value={form.animal_type}
            onChange={(e) => setForm({ ...form, animal_type: e.target.value })}
          >
            <option value="">-- Select Animal Type --</option>
            {form.animal_type && !ANIMAL_TYPE_OPTIONS.includes(form.animal_type) && (
              <option value={form.animal_type}>{form.animal_type}</option>
            )}
            {ANIMAL_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            className="input-field"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <input
            className="input-field"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="e.g. Purchased, Born on farm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Health Status</label>
          <select
            className="input-field"
            value={form.health_status}
            onChange={(e) => setForm({ ...form, health_status: e.target.value })}
          >
            {HEALTH_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pregnancy Status</label>
          <select
            className="input-field"
            value={form.pregnancy_status}
            onChange={(e) => setForm({ ...form, pregnancy_status: e.target.value })}
          >
            {PREGNANCY_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animal Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="input-field text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onImageSelect) onImageSelect(file);
            }}
          />
          {errors.image && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.image}</div>}
        </div>
      </div>

      {(imagePreview || form.image_url) && (
        <div className="flex items-start gap-4 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <img
            src={imagePreview || form.image_url}
            alt="Animal preview"
            className="w-24 h-24 rounded-lg object-cover border"
            style={{ borderColor: 'var(--border)' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              Image preview
            </p>
            {form.image_url && !imagePreview && (
              <p className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>
                {form.image_url}
              </p>
            )}
            {onImageClear && (
              <button type="button" className="btn-secondary text-sm py-1 px-3" onClick={onImageClear}>
                Remove image
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Milking Now</label>
          <select
            className="input-field"
            value={form.milking_now}
            onChange={(e) => setForm({ ...form, milking_now: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Is Calf</label>
          <select
            className="input-field"
            value={form.is_calf}
            onChange={(e) => setForm({ ...form, is_calf: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
    </>
  );
}
