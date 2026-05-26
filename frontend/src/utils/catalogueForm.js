const baseCatalogueForm = {
  animal_id: '',
  milk_type: '',
  fat_percentage: '',
  lactose_percentage: '',
  protein_percentage: '',
  acidity_percentage: '',
  snf_percentage: '',
  remarks: '',
};

export function getInitialCatalogueForm() {
  return { ...baseCatalogueForm };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

export function buildCataloguePayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    milk_type: String(form.milk_type || '').trim(),
    fat_percentage: emptyToNull(form.fat_percentage),
    lactose_percentage: emptyToNull(form.lactose_percentage),
    protein_percentage: emptyToNull(form.protein_percentage),
    acidity_percentage: emptyToNull(form.acidity_percentage),
    snf_percentage: emptyToNull(form.snf_percentage),
    remarks: emptyToNull(form.remarks),
  };
}

export function catalogueFromRecord(r) {
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    milk_type: r.milk_type || '',
    fat_percentage: r.fat_percentage ?? '',
    lactose_percentage: r.lactose_percentage ?? '',
    protein_percentage: r.protein_percentage ?? '',
    acidity_percentage: r.acidity_percentage ?? '',
    snf_percentage: r.snf_percentage ?? '',
    remarks: r.remarks || '',
  };
}
