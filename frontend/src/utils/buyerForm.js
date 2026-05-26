const baseBuyerForm = {
  buyer_name: '',
  is_organization: 'no',
  contact_person: '',
  gst_no: '',
  max_credit: '',
  contact_no: '',
  alt_phone: '',
  email: '',
  buyer_to_pay: '',
};

export function getInitialBuyerForm() {
  return { ...baseBuyerForm };
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

const normalizeOrg = (v) => {
  if (v === 'yes' || v === 'Yes' || v === true || v === 1) return 'Yes';
  return 'No';
};

const orgToForm = (v) => {
  if (v === 'Yes' || v === 'yes' || v === true || v === 1) return 'yes';
  return 'no';
};

export function buildBuyerPayload(form) {
  return {
    buyer_name: form.buyer_name?.trim(),
    is_organization: normalizeOrg(form.is_organization),
    contact_person: emptyToNull(form.contact_person),
    gst_no: emptyToNull(form.gst_no),
    max_credit: numOrNull(form.max_credit),
    contact_no: emptyToNull(form.contact_no),
    alt_phone: emptyToNull(form.alt_phone),
    email: emptyToNull(form.email),
    buyer_to_pay: numOrNull(form.buyer_to_pay),
  };
}

export function buyerFromRecord(r) {
  return {
    buyer_name: r.buyer_name || '',
    is_organization: orgToForm(r.is_organization),
    contact_person: r.contact_person || '',
    gst_no: r.gst_no || '',
    max_credit: r.max_credit ?? '',
    contact_no: r.contact_no || '',
    alt_phone: r.alt_phone || '',
    email: r.email || '',
    buyer_to_pay: r.buyer_to_pay ?? '',
  };
}
