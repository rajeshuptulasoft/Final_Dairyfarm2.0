const today = () => new Date().toISOString().slice(0, 10);

const baseStockForm = {
  item_id: '',
  entry_date: '',
  batch_code: '',
  supplier: '',
  donor: '',
  supplier_type: 'Vendor',
  category: '',
  sub_category: '',
  bill_code: '',
  bill_date: '',
  quantity: '',
  unit: 'Kg',
  remarks: '',
};

export function getInitialStockForm() {
  return { ...baseStockForm, entry_date: today() };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

export function buildStockPayload(form) {
  return {
    item_id: parseInt(form.item_id, 10),
    entry_date: form.entry_date,
    batch_code: emptyToNull(form.batch_code),
    supplier: emptyToNull(form.supplier),
    donor: emptyToNull(form.donor),
    supplier_type: emptyToNull(form.supplier_type),
    category: emptyToNull(form.category),
    sub_category: emptyToNull(form.sub_category),
    bill_code: emptyToNull(form.bill_code),
    bill_date: emptyToNull(form.bill_date),
    quantity: parseFloat(form.quantity),
    unit: form.unit || 'Kg',
    remarks: emptyToNull(form.remarks),
  };
}

export function stockFromRecord(r) {
  return {
    item_id: r.item_id ? String(r.item_id) : '',
    entry_date: r.entry_date || today(),
    batch_code: r.batch_code || '',
    supplier: r.supplier || '',
    donor: r.donor || '',
    supplier_type: r.supplier_type || 'Vendor',
    category: r.category || '',
    sub_category: r.sub_category || '',
    bill_code: r.bill_code || '',
    bill_date: r.bill_date || '',
    quantity: r.quantity ?? '',
    unit: r.unit || 'Kg',
    remarks: r.remarks || '',
  };
}
