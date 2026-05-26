const today = () => new Date().toISOString().slice(0, 10);

const basePurchaseForm = {
  item_id: '',
  purchase_date: '',
  bill_code: '',
  quantity: '',
  rate: '',
  unit: 'Kg',
  paid: 'no',
  remarks: '',
};

export function getInitialPurchaseForm() {
  return { ...basePurchaseForm, purchase_date: today() };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

const normalizePaid = (v) => {
  if (v === 'yes' || v === 'Yes' || v === true || v === 1 || v === '1') return 'Yes';
  return 'No';
};

export function buildPurchasePayload(form) {
  return {
    item_id: parseInt(form.item_id, 10),
    purchase_date: form.purchase_date,
    bill_code: emptyToNull(form.bill_code),
    quantity: parseFloat(form.quantity),
    rate: parseFloat(form.rate),
    unit: form.unit || 'Kg',
    paid: normalizePaid(form.paid),
    remarks: emptyToNull(form.remarks),
  };
}

export function purchaseFromRecord(r) {
  const paid =
    r.paid === 'Yes' || r.paid === 'yes' || r.paid === true || r.paid === 1 ? 'yes' : 'no';
  return {
    item_id: r.item_id ? String(r.item_id) : '',
    purchase_date: r.purchase_date || today(),
    bill_code: r.bill_code || '',
    quantity: r.quantity ?? '',
    rate: r.rate ?? '',
    unit: r.unit || 'Kg',
    paid,
    remarks: r.remarks || '',
  };
}
