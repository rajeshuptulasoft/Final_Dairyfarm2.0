const baseLivestockForm = {
  livestock_type: 'Animal',
  base_fodder_item_id: '',
  group_name: 'Cow',
  breed: '',
  milking: 'Yes',
  delivers: 'Calf',
  pregnancy_duration: '',
  pregnancy_span: 'Days',
  daily_feed_count: '',
  feed_time_01: '',
  feed_time_02: '',
  feed_time_03: '',
  feed_time_04: '',
  feed_time_05: '',
  daily_normal_feed_qty: '',
  daily_normal_feed_unit: 'Kg',
  daily_pregnant_feed_qty: '',
  daily_pregnant_feed_unit: 'Kg',
  daily_calf_feed_qty: '',
  daily_calf_feed_unit: 'Kg',
};

export function getInitialLivestockForm() {
  return { ...baseLivestockForm };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

const numOrNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

function resolveFodderItemId(form, items = []) {
  if (form.base_fodder_item_id) {
    const id = parseInt(form.base_fodder_item_id, 10);
    return Number.isNaN(id) ? null : id;
  }
  if (!form.base_fodder || !items.length) return null;
  const slug = String(form.base_fodder).toLowerCase().trim();
  const match = items.find((i) => {
    const name = (i.item_name || '').toLowerCase();
    return name === slug || name.replace(/\s/g, '') === slug.replace(/\s/g, '') || name.includes(slug);
  });
  return match ? match.id : null;
}

export function buildLivestockPayload(form, items = []) {
  const payload = {
    livestock_type: form.livestock_type,
    group_name: form.group_name,
    breed: emptyToNull(form.breed),
    milking: form.milking || 'No',
    delivers: emptyToNull(form.delivers),
    pregnancy_duration: numOrNull(form.pregnancy_duration),
    pregnancy_span: form.pregnancy_span || 'Days',
    daily_feed_count: numOrNull(form.daily_feed_count),
    feed_time_01: emptyToNull(form.feed_time_01),
    feed_time_02: emptyToNull(form.feed_time_02),
    feed_time_03: emptyToNull(form.feed_time_03),
    feed_time_04: emptyToNull(form.feed_time_04),
    feed_time_05: emptyToNull(form.feed_time_05),
    daily_normal_feed_qty: numOrNull(form.daily_normal_feed_qty),
    daily_normal_feed_unit: form.daily_normal_feed_unit || 'Kg',
    daily_pregnant_feed_qty: numOrNull(form.daily_pregnant_feed_qty),
    daily_pregnant_feed_unit: form.daily_pregnant_feed_unit || 'Kg',
    daily_calf_feed_qty: numOrNull(form.daily_calf_feed_qty),
    daily_calf_feed_unit: form.daily_calf_feed_unit || 'Kg',
  };

  const fodderId = resolveFodderItemId(form, items);
  if (fodderId) {
    payload.base_fodder_item_id = fodderId;
  } else if (form.base_fodder) {
    payload.base_fodder = form.base_fodder;
  }

  return payload;
}

export function livestockFromRecord(r) {
  return {
    livestock_type: r.livestock_type || 'Animal',
    base_fodder_item_id: r.base_fodder_item_id ? String(r.base_fodder_item_id) : '',
    group_name: r.group_name || 'Cow',
    breed: r.breed || '',
    milking: r.milking || 'Yes',
    delivers: r.delivers || 'Calf',
    pregnancy_duration: r.pregnancy_duration ?? '',
    pregnancy_span: r.pregnancy_span || 'Days',
    daily_feed_count: r.daily_feed_count ?? '',
    feed_time_01: r.feed_time_01 || '',
    feed_time_02: r.feed_time_02 || '',
    feed_time_03: r.feed_time_03 || '',
    feed_time_04: r.feed_time_04 || '',
    feed_time_05: r.feed_time_05 || '',
    daily_normal_feed_qty: r.daily_normal_feed_qty ?? '',
    daily_normal_feed_unit: r.daily_normal_feed_unit || 'Kg',
    daily_pregnant_feed_qty: r.daily_pregnant_feed_qty ?? '',
    daily_pregnant_feed_unit: r.daily_pregnant_feed_unit || 'Kg',
    daily_calf_feed_qty: r.daily_calf_feed_qty ?? '',
    daily_calf_feed_unit: r.daily_calf_feed_unit || 'Kg',
  };
}
