export default function StockFormFields({ form, setForm, items = [] }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
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
        <label className="block text-sm font-medium mb-1">Entry Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.entry_date}
          onChange={(e) => set('entry_date', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Batch Code</label>
        <input
          className="input-field"
          value={form.batch_code}
          onChange={(e) => set('batch_code', e.target.value)}
          placeholder="Enter batch code"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Supplier</label>
        <input
          className="input-field"
          value={form.supplier}
          onChange={(e) => set('supplier', e.target.value)}
          placeholder="Enter supplier"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Donor</label>
        <input
          className="input-field"
          value={form.donor}
          onChange={(e) => set('donor', e.target.value)}
          placeholder="Enter donor"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Supplier Type</label>
        <select
          className="input-field"
          value={form.supplier_type}
          onChange={(e) => set('supplier_type', e.target.value)}
        >
          <option value="Vendor">Vendor</option>
          <option value="Farmer">Farmer</option>
          <option value="Distributor">Distributor</option>
          <option value="Donation">Donation</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select className="input-field" value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">Select category</option>
          <option value="Cheese">Cheese</option>
          <option value="Milk">Milk</option>
          <option value="Yogurt">Yogurt</option>
          <option value="Fodder">Fodder</option>
          <option value="Equipment">Equipment</option>
          <option value="Medicine">Medicine</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sub Category</label>
        <select className="input-field" value={form.sub_category} onChange={(e) => set('sub_category', e.target.value)}>
          <option value="">—</option>
          <option value="default">default</option>
          <option value="milk">milk</option>
          <option value="cheese">cheese</option>
          <option value="yogurt">yogurt</option>
          <option value="fodder">fodder</option>
          <option value="medicine">medicine</option>
          <option value="other">other</option>
        </select>
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
        <label className="block text-sm font-medium mb-1">Bill Date</label>
        <input
          type="date"
          className="input-field"
          value={form.bill_date}
          onChange={(e) => set('bill_date', e.target.value)}
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
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Unit *</label>
        <select className="input-field" value={form.unit} onChange={(e) => set('unit', e.target.value)} required>
          <option value="Kg">Kg</option>
          <option value="L">L</option>
          <option value="Pieces">Pieces</option>
          <option value="Bags">Bags</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
          placeholder="Enter remarks"
        />
      </div>
    </div>
  );
}
