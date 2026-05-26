const today = () => new Date().toISOString().slice(0, 10);

const baseHealthForm = {
  animal_id: '',
  health_issue_date: '',
  doctor_name: '',
  estimated_cost: '',
  symptoms: '',
  remedy_taken: '',
  remedy_suggested: '',
  doctor_charges: '',
  paid: 'no',
  remarks: '',
};

export function getInitialHealthForm() {
  return { ...baseHealthForm, health_issue_date: today() };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

const normalizePaid = (v) => {
  if (v === 'yes' || v === 'Yes' || v === true || v === 1 || v === '1') return 'Yes';
  return 'No';
};

export function buildHealthPayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    health_issue_date: form.health_issue_date || form.health_date || today(),
    doctor_name: String(form.doctor_name || '').trim(),
    estimated_cost: emptyToNull(form.estimated_cost),
    symptoms: String(form.symptoms || '').trim(),
    remedy_taken: emptyToNull(form.remedy_taken),
    remedy_suggested: emptyToNull(form.remedy_suggested),
    doctor_charges: emptyToNull(form.doctor_charges),
    paid: normalizePaid(form.paid),
    remarks: emptyToNull(form.remarks),
  };
}

export function healthFromRecord(r) {
  const paidRaw = r.paid ?? 'No';
  const paid =
    paidRaw === 'Yes' || paidRaw === 'yes' || paidRaw === true || paidRaw === 1
      ? 'yes'
      : 'no';
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    health_issue_date: r.health_issue_date || r.health_date || today(),
    doctor_name: r.doctor_name || '',
    estimated_cost: r.estimated_cost ?? '',
    symptoms: r.symptoms || r.diagnosis || '',
    remedy_taken: r.remedy_taken || '',
    remedy_suggested: r.remedy_suggested || '',
    doctor_charges: r.doctor_charges ?? '',
    paid,
    remarks: r.remarks || r.notes || '',
  };
}
