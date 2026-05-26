export default function HealthFormFields({ form, setForm, animals = [] }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const dateVal = form.health_issue_date ?? form.health_date ?? '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Health Issue Date *</label>
        <input
          type="date"
          className="input-field"
          value={dateVal}
          onChange={(e) => set('health_issue_date', e.target.value)}
          required
        />
      </div>
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
        <label className="block text-sm font-medium mb-1">Doctor Name *</label>
        <input
          className="input-field"
          value={form.doctor_name}
          onChange={(e) => set('doctor_name', e.target.value)}
          placeholder="Enter doctor name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Estimated Cost (₹)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.estimated_cost}
          onChange={(e) => set('estimated_cost', e.target.value)}
          placeholder="Enter estimated cost"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Symptoms *</label>
        <textarea
          className="input-field"
          rows={2}
          value={form.symptoms}
          onChange={(e) => set('symptoms', e.target.value)}
          placeholder="Enter symptoms"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Remedy Taken</label>
        <textarea
          className="input-field"
          rows={2}
          value={form.remedy_taken}
          onChange={(e) => set('remedy_taken', e.target.value)}
          placeholder="Enter remedy taken"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Remedy Suggested</label>
        <textarea
          className="input-field"
          rows={2}
          value={form.remedy_suggested}
          onChange={(e) => set('remedy_suggested', e.target.value)}
          placeholder="Enter remedy suggested"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Doctor Charges (₹)</label>
        <input
          type="number"
          step="0.01"
          className="input-field"
          value={form.doctor_charges}
          onChange={(e) => set('doctor_charges', e.target.value)}
          placeholder="Enter doctor charges"
        />
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
          rows={2}
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
          placeholder="Enter remarks"
        />
      </div>
    </div>
  );
}
