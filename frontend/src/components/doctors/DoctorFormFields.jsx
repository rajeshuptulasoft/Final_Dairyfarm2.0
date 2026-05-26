export default function DoctorFormFields({ form, setForm }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Doctor Name *</label>
          <input
            className="input-field"
            value={form.doctor_name}
            onChange={(e) => set('doctor_name', e.target.value)}
            placeholder="Doctor name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost / Visit (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field"
            value={form.cost_visit}
            onChange={(e) => set('cost_visit', e.target.value)}
            placeholder="Per visit"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost / Hour (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field"
            value={form.cost_hour}
            onChange={(e) => set('cost_hour', e.target.value)}
            placeholder="Per hour"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost / Online (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field"
            value={form.cost_online}
            onChange={(e) => set('cost_online', e.target.value)}
            placeholder="Online consultation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact No *</label>
          <input
            className="input-field"
            value={form.contact_no}
            onChange={(e) => set('contact_no', e.target.value)}
            placeholder="Phone number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alt Phone</label>
          <input
            className="input-field"
            value={form.alt_phone}
            onChange={(e) => set('alt_phone', e.target.value)}
            placeholder="Alternate phone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            className="input-field"
            value={form.rating}
            onChange={(e) => set('rating', e.target.value)}
            placeholder="Rating"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="Clinic address"
        />
      </div>
    </>
  );
}
