export default function LivestockFormFields({ form, setForm, items = [] }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const fodderItems = items.filter(
    (i) => i.is_fodder === 'yes' || i.is_fodder === 'Yes' || i.is_fodder === 1 || i.is_fodder === true
  );
  const fodderOptions = fodderItems.length > 0 ? fodderItems : items;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Livestock Type *</label>
          <select
            className="input-field"
            value={form.livestock_type}
            onChange={(e) => set('livestock_type', e.target.value)}
          >
            <option value="Animal">Animal</option>
            <option value="Poultry">Poultry</option>
            <option value="Sheep">Sheep</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Base Fodder Item</label>
          <select
            className="input-field"
            value={form.base_fodder_item_id}
            onChange={(e) => set('base_fodder_item_id', e.target.value)}
          >
            <option value="">-- Select Item --</option>
            {fodderOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Group Name *</label>
          <select
            className="input-field"
            value={form.group_name}
            onChange={(e) => set('group_name', e.target.value)}
            required
          >
            <option value="Cow">Cow</option>
            <option value="Buffalo">Buffalo</option>
            <option value="Goat">Goat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Breed</label>
          <input
            className="input-field"
            value={form.breed}
            onChange={(e) => set('breed', e.target.value)}
            placeholder="Enter breed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Milking</label>
          <select className="input-field" value={form.milking} onChange={(e) => set('milking', e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivers</label>
          <select className="input-field" value={form.delivers} onChange={(e) => set('delivers', e.target.value)}>
            <option value="Calf">Calf</option>
            <option value="Foal">Foal</option>
            <option value="Kid">Kid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pregnancy Duration</label>
          <input
            type="number"
            className="input-field"
            value={form.pregnancy_duration}
            onChange={(e) => set('pregnancy_duration', e.target.value)}
            placeholder="Duration"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pregnancy Span</label>
          <select
            className="input-field"
            value={form.pregnancy_span}
            onChange={(e) => set('pregnancy_span', e.target.value)}
          >
            <option value="Days">Days</option>
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily Feed Count</label>
          <input
            type="number"
            className="input-field"
            value={form.daily_feed_count}
            onChange={(e) => set('daily_feed_count', e.target.value)}
            placeholder="Feed count"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
        {[1, 2, 3, 4, 5].map((i) => {
          const key = `feed_time_0${i}`;
          return (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">Feed Time 0{i}</label>
              <input
                type="time"
                className="input-field"
                value={form[key] || ''}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {[
          { qtyKey: 'daily_normal_feed_qty', unitKey: 'daily_normal_feed_unit', label: 'Normal Feed Qty' },
          { qtyKey: 'daily_pregnant_feed_qty', unitKey: 'daily_pregnant_feed_unit', label: 'Pregnant Feed Qty' },
          { qtyKey: 'daily_calf_feed_qty', unitKey: 'daily_calf_feed_unit', label: 'Calf Feed Qty' },
        ].map(({ qtyKey, unitKey, label }) => (
          <div key={qtyKey}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div
              className="grid gap-2 items-stretch"
              style={{ gridTemplateColumns: 'minmax(0, 1fr) 5.5rem' }}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field min-w-0"
                value={form[qtyKey]}
                onChange={(e) => set(qtyKey, e.target.value)}
                placeholder="Enter quantity"
                required
              />
              <select
                className="input-field min-w-0 px-2"
                style={{ width: '100%' }}
                value={form[unitKey]}
                onChange={(e) => set(unitKey, e.target.value)}
              >
                <option value="Kg">Kg</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
