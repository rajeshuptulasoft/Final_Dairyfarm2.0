const baseItemForm = {
  item_name: '',
  is_fodder: 'yes',
  item_type: 'Fodder',
  item_life: '',
  item_life_unit: 'Minutes',
  is_active: 1,
};

export function getInitialItemForm() {
  return { ...baseItemForm };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

export function buildItemPayload(form, { forUpdate = false } = {}) {
  const payload = {
    item_name: String(form.item_name || '').trim(),
    is_fodder: form.is_fodder || 'yes',
    item_type: form.item_type || 'Fodder',
    item_life: emptyToNull(form.item_life),
    item_life_unit: emptyToNull(form.item_life_unit),
  };
  if (forUpdate) {
    payload.is_active = form.is_active ?? 1;
  }
  return payload;
}

export function itemFromRecord(r) {
  return {
    item_name: r.item_name || '',
    is_fodder: r.is_fodder || 'yes',
    item_type: r.item_type || 'Fodder',
    item_life: r.item_life ?? '',
    item_life_unit: r.item_life_unit || 'Minutes',
    is_active: r.is_active ?? 1,
  };
}
