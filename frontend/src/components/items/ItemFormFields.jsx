export default function ItemFormFields({ form, setForm }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Item Name *</label>
        <input
          className="input-field"
          value={form.item_name}
          onChange={(e) => set('item_name', e.target.value)}
          placeholder="Enter item name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Is Fodder</label>
        <select className="input-field" value={form.is_fodder} onChange={(e) => set('is_fodder', e.target.value)}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Item Type *</label>
        <select className="input-field" value={form.item_type} onChange={(e) => set('item_type', e.target.value)} required>
          <option value="Fodder">Fodder</option>
          <option value="Product">Product</option>
          <option value="Supply">Supply</option>
          <option value="Medicine">Medicine</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Item Life</label>
        <input
          type="number"
          className="input-field"
          value={form.item_life}
          onChange={(e) => set('item_life', e.target.value)}
          placeholder="e.g. 30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Item Life Unit</label>
        <select className="input-field" value={form.item_life_unit} onChange={(e) => set('item_life_unit', e.target.value)}>
          <option value="Minutes">Minutes</option>
          <option value="Hours">Hours</option>
          <option value="Days">Days</option>
          <option value="Months">Months</option>
        </select>
      </div>
    </div>
  );
}
