export default function VendorFormFields({ form, setForm }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Vendor Name *</label>
        <input
          className="input-field"
          value={form.vendor_name}
          onChange={(e) => set('vendor_name', e.target.value)}
          placeholder="Vendor name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Organization</label>
        <input
          className="input-field"
          value={form.organization}
          onChange={(e) => set('organization', e.target.value)}
          placeholder="Organization name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">GST No</label>
        <input
          className="input-field"
          value={form.gst_no}
          onChange={(e) => set('gst_no', e.target.value)}
          placeholder="GST number"
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
        <label className="block text-sm font-medium mb-1">Max Credit (₹)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input-field"
          value={form.max_credit}
          onChange={(e) => set('max_credit', e.target.value)}
          placeholder="Max credit"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">To Pay (₹)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input-field"
          value={form.to_pay}
          onChange={(e) => set('to_pay', e.target.value)}
          placeholder="Amount to pay"
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
    </div>
  );
}
