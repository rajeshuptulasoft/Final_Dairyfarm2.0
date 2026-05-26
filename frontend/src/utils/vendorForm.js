const baseVendorForm = {
  vendor_name: '',
  organization: '',
  gst_no: '',
  contact_no: '',
  email: '',
  max_credit: '',
  to_pay: '',
  alt_phone: '',
};

export function getInitialVendorForm() {
  return { ...baseVendorForm };
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

export function buildVendorPayload(form) {
  return {
    vendor_name: form.vendor_name?.trim(),
    organization: emptyToNull(form.organization),
    gst_no: emptyToNull(form.gst_no),
    contact_no: emptyToNull(form.contact_no),
    email: emptyToNull(form.email),
    max_credit: numOrNull(form.max_credit),
    to_pay: numOrNull(form.to_pay),
    alt_phone: emptyToNull(form.alt_phone),
  };
}

export function vendorFromRecord(r) {
  return {
    vendor_name: r.vendor_name || '',
    organization: r.organization || r.organization_name || '',
    gst_no: r.gst_no || '',
    contact_no: r.contact_no || '',
    email: r.email || '',
    max_credit: r.max_credit ?? r.max_credit_amount ?? '',
    to_pay: r.to_pay ?? '',
    alt_phone: r.alt_phone || r.alt_phone_no || '',
  };
}
