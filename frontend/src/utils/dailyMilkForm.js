const today = () => new Date().toISOString().slice(0, 10);

const baseDailyMilkForm = {
  animal_id: '',
  milk_date: '',
  milk_type: '',
  quantity_ltr: '',
  unit: 'Kg',
  fat_percentage: '',
  lactose_percentage: '',
  protein_percentage: '',
  acidity_percentage: '',
  snf_percentage: '',
  time_of_day: 'Morning',
  remarks: '',
  collected_by: '',
};

export const initialDailyMilkForm = { ...baseDailyMilkForm, milk_date: today() };

export function getInitialDailyMilkForm() {
  return { ...baseDailyMilkForm, milk_date: today() };
}

export function buildDailyMilkPayload(form) {
  const emptyToNull = (v) => {
    if (v === '' || v === undefined || v === null) return null;
    return v;
  };

  return {
    animal_id: parseInt(form.animal_id, 10),
    milk_date: form.milk_date,
    milk_type: String(form.milk_type || '').trim(),
    quantity_ltr: parseFloat(form.quantity_ltr),
    unit: form.unit || 'Kg',
    fat_percentage: emptyToNull(form.fat_percentage),
    lactose_percentage: emptyToNull(form.lactose_percentage),
    protein_percentage: emptyToNull(form.protein_percentage),
    acidity_percentage: emptyToNull(form.acidity_percentage),
    snf_percentage: emptyToNull(form.snf_percentage),
    time_of_day: form.time_of_day || 'Morning',
    remarks: emptyToNull(form.remarks),
    collected_by: emptyToNull(form.collected_by),
  };
}

export function dailyMilkFromRecord(r) {
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    milk_date: r.milk_date || today(),
    milk_type: r.milk_type || '',
    quantity_ltr: r.quantity_ltr ?? '',
    unit: r.unit || 'Kg',
    fat_percentage: r.fat_percentage ?? '',
    lactose_percentage: r.lactose_percentage ?? '',
    protein_percentage: r.protein_percentage ?? '',
    acidity_percentage: r.acidity_percentage ?? '',
    snf_percentage: r.snf_percentage ?? '',
    time_of_day: r.time_of_day || 'Morning',
    remarks: r.remarks || '',
    collected_by: r.collected_by || '',
  };
}
