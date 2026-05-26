export default function CatalogueFormFields({ form, setForm, animals = [] }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);
  const selected = activeAnimals.find((a) => String(a.id) === String(form.animal_id));

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Animal *</label>
        <select
          className="input-field"
          value={form.animal_id}
          onChange={(e) => set('animal_id', e.target.value)}
          required
        >
          <option value="">-- Select Animal --</option>
          {activeAnimals.map((a) => (
            <option key={a.id} value={a.id}>
              #{a.tag_number} — {a.name || 'Unnamed'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Milk Type *</label>
        <input
          className="input-field"
          value={form.milk_type}
          onChange={(e) => set('milk_type', e.target.value)}
          placeholder="e.g. Cow milk"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animal Type</label>
        <input className="input-field" value={selected?.animal_type || ''} readOnly tabIndex={-1} placeholder="Select an animal" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breed</label>
        <input className="input-field" value={selected?.breed || ''} readOnly tabIndex={-1} placeholder="Select an animal" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fat (%)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.fat_percentage}
          onChange={(e) => set('fat_percentage', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lactose (%)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.lactose_percentage}
          onChange={(e) => set('lactose_percentage', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Protein (%)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.protein_percentage}
          onChange={(e) => set('protein_percentage', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Acidity (%)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.acidity_percentage}
          onChange={(e) => set('acidity_percentage', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">SnF (%)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.snf_percentage}
          onChange={(e) => set('snf_percentage', e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <input
          className="input-field"
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
        />
      </div>
    </div>
  );
}
