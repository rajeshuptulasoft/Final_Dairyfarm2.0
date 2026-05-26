const baseDoctorForm = {
  doctor_name: '',
  cost_visit: '',
  cost_hour: '',
  cost_online: '',
  contact_no: '',
  alt_phone: '',
  email: '',
  rating: '',
  address: '',
};

export function getInitialDoctorForm() {
  return { ...baseDoctorForm };
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

export function buildDoctorPayload(form) {
  return {
    doctor_name: form.doctor_name?.trim(),
    cost_visit: numOrNull(form.cost_visit),
    cost_hour: numOrNull(form.cost_hour),
    cost_online: numOrNull(form.cost_online),
    contact_no: emptyToNull(form.contact_no),
    alt_phone: emptyToNull(form.alt_phone),
    email: emptyToNull(form.email),
    rating: numOrNull(form.rating),
    address: emptyToNull(form.address),
  };
}

export function doctorFromRecord(r) {
  return {
    doctor_name: r.doctor_name || '',
    cost_visit: r.cost_visit ?? '',
    cost_hour: r.cost_hour ?? '',
    cost_online: r.cost_online ?? '',
    contact_no: r.contact_no || '',
    alt_phone: r.alt_phone || r.alt_phone_no || '',
    email: r.email || '',
    rating: r.rating ?? '',
    address: r.address || '',
  };
}
