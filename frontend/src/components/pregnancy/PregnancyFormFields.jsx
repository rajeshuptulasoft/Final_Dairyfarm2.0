export default function PregnancyFormFields({ form, setForm, animals = [] }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
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
        <label className="block text-sm font-medium mb-1">PD Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.pd_date}
          onChange={(e) => set('pd_date', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Calv Due Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.calv_due_date}
          onChange={(e) => set('calv_due_date', e.target.value)}
          required
        />
      </div>
    </div>
  );
}
