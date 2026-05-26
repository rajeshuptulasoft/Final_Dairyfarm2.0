import { useMemo } from 'react';
import { TIME_OF_DAY_OPTIONS, UNIT_OPTIONS } from '../../utils/dailyFoodForm';

function FieldRow({ label, required, children }) {
  return (
    <div className="daily-food-field-row">
      <label className="daily-food-label-inline">
        {required && <span className="daily-food-required">*</span>} {label}
      </label>
      <div className="daily-food-field-control">{children}</div>
    </div>
  );
}

export default function DailyFoodFormFields({ form, setForm, animals = [], fodderItems = [] }) {
  const cows = useMemo(
    () => animals.filter((a) => a.status === 'active' && a.tag_number),
    [animals]
  );

  const nameOptions = useMemo(() => {
    if (form.tag_number) {
      const match = cows.find((a) => String(a.tag_number) === String(form.tag_number));
      return match ? [match] : cows;
    }
    return cows;
  }, [cows, form.tag_number]);

  const selectedFodder = useMemo(
    () => fodderItems.find((i) => String(i.id) === String(form.item_id)),
    [fodderItems, form.item_id]
  );

  const onTagChange = (tag) => {
    const animal = cows.find((a) => String(a.tag_number) === String(tag));
    setForm((f) => ({
      ...f,
      tag_number: tag,
      animal_id: animal ? String(animal.id) : '',
      animal_name: animal?.name || '',
    }));
  };

  const onNameChange = (animalId) => {
    const animal = cows.find((a) => String(a.id) === String(animalId));
    setForm((f) => ({
      ...f,
      animal_id: animalId,
      animal_name: animal?.name || '',
      tag_number: animal ? String(animal.tag_number) : '',
    }));
  };

  const onItemChange = (itemId) => {
    const item = fodderItems.find((i) => String(i.id) === String(itemId));
    setForm((f) => ({
      ...f,
      item_id: itemId,
      item_name: item?.item_name || '',
    }));
  };

  return (
    <div className="daily-food-form-grid">
      <div className="daily-food-column">
        <FieldRow label="Food Date" required>
          <input
            type="date"
            className="daily-food-input"
            value={form.food_date}
            onChange={(e) => setForm({ ...form, food_date: e.target.value })}
            required
          />
        </FieldRow>

        <FieldRow label="Animal Tag :" required>
          <select
            className="daily-food-input"
            value={form.tag_number}
            onChange={(e) => onTagChange(e.target.value)}
            required
          >
            <option value="">-- Select Tag --</option>
            {cows.map((a) => (
              <option key={a.id} value={a.tag_number}>
                {a.tag_number}
              </option>
            ))}
          </select>
        </FieldRow>

        <FieldRow label="Animal Name :" required>
          <select
            className="daily-food-input"
            value={form.animal_id}
            onChange={(e) => onNameChange(e.target.value)}
            required
          >
            <option value="">-- Select Name --</option>
            {nameOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || `Cow #${a.tag_number}`}
              </option>
            ))}
          </select>
        </FieldRow>

        <FieldRow label="Time of Day">
          <select
            className="daily-food-input"
            value={form.time_of_day}
            onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
          >
            {TIME_OF_DAY_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FieldRow>
      </div>

      <div className="daily-food-column">
        <FieldRow label="Fodder Item" required>
          <select
            className="daily-food-input"
            value={form.item_id}
            onChange={(e) => onItemChange(e.target.value)}
            required
          >
            <option value="">-- Select Fodder Item --</option>
            {fodderItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name} (Stock: {Number(item.stock_qty ?? 0).toFixed(2)} Kg)
              </option>
            ))}
          </select>
          {fodderItems.length === 0 && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              No fodder items found. Add items with type &quot;Fodder&quot; in Settings → Items.
            </p>
          )}
        </FieldRow>

        {selectedFodder && (
          <FieldRow label="Available Stock">
            <input
              type="text"
              className="daily-food-input"
              readOnly
              value={`${Number(selectedFodder.stock_qty ?? 0).toFixed(2)} Kg`}
            />
          </FieldRow>
        )}

        <FieldRow label="Quantity" required>
          <input
            type="number"
            step="0.01"
            min="0"
            className="daily-food-input"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </FieldRow>

        <FieldRow label="Unit" required>
          <select
            className="daily-food-input"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            required
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </FieldRow>

        <FieldRow label="Remarks :">
          <textarea
            className="daily-food-input daily-food-textarea"
            rows={4}
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
        </FieldRow>
      </div>
    </div>
  );
}
