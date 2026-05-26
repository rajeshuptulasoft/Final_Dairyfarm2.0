export default function PurchaseFormFields({ form, setForm, items = [] }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const qty = parseFloat(form.quantity);
  const rate = parseFloat(form.rate);
  const total = !Number.isNaN(qty) && !Number.isNaN(rate) ? (qty * rate).toFixed(2) : '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Item *</label>
        <select
          className="input-field"
          value={form.item_id}
          onChange={(e) => set('item_id', e.target.value)}
          required
        >
          <option value="">-- Select Item --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.item_name} ({item.item_type || 'Item'})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Purchase Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.purchase_date}
          onChange={(e) => set('purchase_date', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bill Code</label>
        <input
          className="input-field"
          value={form.bill_code}
          onChange={(e) => set('bill_code', e.target.value)}
          placeholder="Enter bill code"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quantity *</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.quantity}
          onChange={(e) => set('quantity', e.target.value)}
          placeholder="Enter quantity"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Unit</label>
        <select className="input-field" value={form.unit} onChange={(e) => set('unit', e.target.value)}>
          <option value="Kg">Kg</option>
          <option value="L">L</option>
          <option value="Pieces">Pieces</option>
          <option value="Bags">Bags</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rate (₹) *</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.rate}
          onChange={(e) => set('rate', e.target.value)}
          placeholder="Enter rate"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Total (₹)</label>
        <input className="input-field" value={total} readOnly tabIndex={-1} placeholder="Auto calculated" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Paid</label>
        <select className="input-field" value={form.paid} onChange={(e) => set('paid', e.target.value)}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
          placeholder="Remarks"
        />
      </div>
    </div>
  );
}
