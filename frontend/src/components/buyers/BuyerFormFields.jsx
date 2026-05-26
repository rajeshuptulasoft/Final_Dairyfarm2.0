export default function BuyerFormFields({ form, setForm }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Buyer Name *</label>
        <input
          className="input-field"
          value={form.buyer_name}
          onChange={(e) => set('buyer_name', e.target.value)}
          placeholder="e.g. Ramesh Dairy"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Organization?</label>
        <select
          className="input-field"
          value={form.is_organization}
          onChange={(e) => set('is_organization', e.target.value)}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact Person</label>
        <input
          className="input-field"
          value={form.contact_person}
          onChange={(e) => set('contact_person', e.target.value)}
          placeholder="Contact person"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">GST No</label>
        <input
          className="input-field"
          value={form.gst_no}
          onChange={(e) => set('gst_no', e.target.value)}
          placeholder="29ABCDE1234F1Z5"
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
          placeholder="50000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact No *</label>
        <input
          className="input-field"
          value={form.contact_no}
          onChange={(e) => set('contact_no', e.target.value)}
          placeholder="9876543210"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Phone</label>
        <input
          className="input-field"
          value={form.alt_phone}
          onChange={(e) => set('alt_phone', e.target.value)}
          placeholder="9123456780"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="input-field"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="ramesh@gmail.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Buyer To Pay (₹)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input-field"
          value={form.buyer_to_pay}
          onChange={(e) => set('buyer_to_pay', e.target.value)}
          placeholder="15000"
        />
      </div>
    </div>
  );
}
