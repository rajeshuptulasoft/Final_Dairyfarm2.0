export default function DailyMilkFormFields({ form, setForm, animals = [], errors = {} }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);

  const onAnimalChange = (animalId) => {
    setForm((prev) => ({ ...prev, animal_id: animalId }));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Milking Date *</label>
          <input
            type="date"
            className="input-field"
            value={form.milk_date}
            onChange={(e) => setForm({ ...form, milk_date: e.target.value })}
            required
          />
          {errors.milk_date && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.milk_date}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fat (%)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.fat_percentage}
            onChange={(e) => setForm({ ...form, fat_percentage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Animal *</label>
          <select
            className="input-field"
            value={form.animal_id}
            onChange={(e) => onAnimalChange(e.target.value)}
            required
          >
            <option value="">-- Select Animal --</option>
            {activeAnimals.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.tag_number} — {a.name}
              </option>
            ))}
          </select>
          {errors.animal_id && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.animal_id}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lactose (%)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.lactose_percentage}
            onChange={(e) => setForm({ ...form, lactose_percentage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Milk Type *</label>
          <input
            className="input-field"
            value={form.milk_type}
            onChange={(e) => setForm({ ...form, milk_type: e.target.value })}
            placeholder="e.g. Cow milk"
            required
          />
          {errors.milk_type && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.milk_type}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Protein (%)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.protein_percentage}
            onChange={(e) => setForm({ ...form, protein_percentage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.quantity_ltr}
            onChange={(e) => setForm({ ...form, quantity_ltr: e.target.value })}
            required
          />
          {errors.quantity_ltr && <div className="text-sm mt-1" style={{ color: '#b91c1c' }}>{errors.quantity_ltr}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Acidity (%)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.acidity_percentage}
            onChange={(e) => setForm({ ...form, acidity_percentage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select
            className="input-field"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          >
            <option value="Kg">Kg</option>
            <option value="Litre">Litre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SnF (%)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.snf_percentage}
            onChange={(e) => setForm({ ...form, snf_percentage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time of Day</label>
          <select
            className="input-field"
            value={form.time_of_day}
            onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Collected by</label>
          <input
            className="input-field"
            value={form.collected_by}
            onChange={(e) => setForm({ ...form, collected_by: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          placeholder="Optional notes"
        />
      </div>

      {errors.form && <div className="text-sm" style={{ color: '#b91c1c' }}>{errors.form}</div>}
    </>
  );
}
