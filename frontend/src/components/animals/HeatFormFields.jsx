export default function HeatFormFields({ form, setForm, animals = [] }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);

  const selected = activeAnimals.find((a) => String(a.id) === String(form.animal_id));

  const onAnimalChange = (animalId) => {
    setForm((prev) => ({ ...prev, animal_id: animalId }));
  };

  return (
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
              #{a.tag_number} — {a.name || 'Unnamed'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breed</label>
        <input
          className="input-field"
          value={selected?.breed || ''}
          readOnly
          placeholder="Select an animal"
          tabIndex={-1}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Heat Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.heat_date}
          onChange={(e) => setForm({ ...form, heat_date: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
