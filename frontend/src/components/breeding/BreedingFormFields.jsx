export default function BreedingFormFields({ form, setForm, animals = [] }) {
  const femaleAnimals = animals.filter(
    (a) =>
      (a.is_active !== 0 && a.is_active !== false) &&
      (a.status === 'active' || a.status === undefined) &&
      a.gender === 'female'
  );

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
          {femaleAnimals.map((a) => (
            <option key={a.id} value={a.id}>
              #{a.tag_number} — {a.name || 'Unnamed'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breeding Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.breeding_date}
          onChange={(e) => set('breeding_date', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Method</label>
        <select className="input-field" value={form.method} onChange={(e) => set('method', e.target.value)}>
          <option value="natural">Natural</option>
          <option value="artificial">Artificial Insemination</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sire Info</label>
        <input
          className="input-field"
          value={form.sire_info}
          onChange={(e) => set('sire_info', e.target.value)}
          placeholder="Enter sire info"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Enter notes"
        />
      </div>
    </div>
  );
}
