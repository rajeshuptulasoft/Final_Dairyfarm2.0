import { Book } from 'lucide-react';

export default function CalvedFormFields({ form, setForm, animals = [] }) {
  const activeAnimals = animals.filter((a) => a.is_active !== 0 && a.is_active !== false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#d97706' }}>
          <Book size={18} /> Calving Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Animal *</label>
            <select className="input-field" value={form.animal_id} onChange={(e) => set('animal_id', e.target.value)} required>
              <option value="">-- Select Animal --</option>
              {activeAnimals.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.tag_number} — {a.name || 'Unnamed'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Calving Date *</label>
            <input type="date" className="input-field" value={form.calving_date} onChange={(e) => set('calving_date', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Veterinarian</label>
            <input className="input-field" value={form.vet_name} onChange={(e) => set('vet_name', e.target.value)} placeholder="Vet name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Calf Count *</label>
            <input type="number" min="1" className="input-field" value={form.calf_count} onChange={(e) => set('calf_count', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Calf Gender</label>
            <select className="input-field" value={form.calf_gender} onChange={(e) => set('calf_gender', e.target.value)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Calf Weight (kg)</label>
            <input type="number" step="0.01" className="input-field" value={form.calf_weight} onChange={(e) => set('calf_weight', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Type</label>
            <select className="input-field" value={form.delivery_type} onChange={(e) => set('delivery_type', e.target.value)}>
              <option value="normal">Normal</option>
              <option value="assisted">Assisted</option>
              <option value="caesarean">Caesarean</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assistance</label>
            <select className="input-field" value={form.assistance} onChange={(e) => set('assistance', e.target.value)}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dam Condition</label>
            <select className="input-field" value={form.dam_condition} onChange={(e) => set('dam_condition', e.target.value)}>
              <option value="healthy">Healthy</option>
              <option value="weak">Weak</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Calf Condition</label>
            <select className="input-field" value={form.calf_condition} onChange={(e) => set('calf_condition', e.target.value)}>
              <option value="healthy">Healthy</option>
              <option value="weak">Weak</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea className="input-field" rows={3} value={form.remarks} onChange={(e) => set('remarks', e.target.value)} placeholder="Notes" />
          </div>
        </div>
      </div>
    </div>
  );
}
