const today = () => new Date().toISOString().split('T')[0];

export const SALE_UNIT_OPTIONS = ['kg', 'litre'];

const baseSaleForm = {
  sale_date: today(),
  customer_name: '',
  customer_phone: '',
  item_id: '',
  quantity: '',
  unit: 'kg',
  rate: '',
  payment_method: 'Cash',
  notes: '',
};

export function getInitialSaleForm() {
  return { ...baseSaleForm, sale_date: today() };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

export function buildSalePayload(form) {
  return {
    sale_date: form.sale_date,
    customer_name: form.customer_name?.trim(),
    customer_phone: emptyToNull(form.customer_phone),
    item_id: parseInt(form.item_id, 10),
    quantity: parseFloat(form.quantity),
    unit: form.unit || 'kg',
    rate: parseFloat(form.rate),
    payment_method: form.payment_method || 'Cash',
    notes: emptyToNull(form.notes),
  };
}

export function saleFromRecord(r) {
  return {
    sale_date: r.sale_date || today(),
    customer_name: r.customer_name || '',
    customer_phone: r.customer_phone || '',
    item_id: r.item_id != null ? String(r.item_id) : '',
    quantity: r.quantity ?? '',
    unit: r.unit || 'kg',
    rate: r.rate ?? '',
    payment_method: r.payment_method || 'Cash',
    notes: r.notes || '',
  };
}

export function calcSaleAmount(quantity, rate) {
  const q = parseFloat(quantity);
  const r = parseFloat(rate);
  if (Number.isNaN(q) || Number.isNaN(r)) return '';
  return (q * r).toFixed(2);
}
