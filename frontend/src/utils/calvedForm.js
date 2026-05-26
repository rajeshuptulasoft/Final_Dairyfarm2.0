const today = () => new Date().toISOString().slice(0, 10);

const baseCalvedForm = {
  animal_id: '',
  health_issue_date: '',
  doctor_name: '',
  symptoms: '',
  remedy_taken: '',
  remedy_suggested: '',
  estimated_cost: '',
  doctor_charges: '',
  paid: 'no',
  breeding_date: '',
  method: 'natural',
  sire_info: '',
  breeding_notes: '',
  pregnancy_check_date: '',
  expected_delivery_date: '',
  calving_date: '',
  vet_name: '',
  calf_count: '1',
  calf_gender: 'female',
  calf_weight: '',
  delivery_type: 'normal',
  assistance: 'no',
  dam_condition: 'healthy',
  calf_condition: 'healthy',
  remarks: '',
};

export function getInitialCalvedForm() {
  return {
    ...baseCalvedForm,
    health_issue_date: today(),
    breeding_date: today(),
    calving_date: today(),
  };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

const normalizePaid = (v) => {
  if (v === 'yes' || v === 'Yes' || v === true || v === 1 || v === '1') return 'Yes';
  return 'No';
};

const normalizeMethod = (method) => {
  const m = String(method || '').toLowerCase();
  if (m === 'artificial' || m.includes('artificial')) return 'Artificial Insemination';
  if (m === 'natural') return 'Natural';
  return method || 'Natural';
};

const capitalize = (s) => {
  if (!s) return s;
  return String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
};

const normalizeAssistance = (v) => {
  if (v === 'yes' || v === 'Yes' || v === true) return 'Yes';
  return 'No';
};

export function buildCalvedPayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    health_issue_date: emptyToNull(form.health_issue_date || form.health_date),
    doctor_name: emptyToNull(form.doctor_name),
    symptoms: emptyToNull(form.symptoms),
    remedy_taken: emptyToNull(form.remedy_taken),
    remedy_suggested: emptyToNull(form.remedy_suggested),
    estimated_cost: emptyToNull(form.estimated_cost),
    doctor_charges: emptyToNull(form.doctor_charges),
    paid: normalizePaid(form.paid),
    breeding_date: emptyToNull(form.breeding_date),
    breeding_method: normalizeMethod(form.method || form.breeding_method),
    sire_info: emptyToNull(form.sire_info),
    breeding_notes: emptyToNull(form.breeding_notes),
    pd_check_date: emptyToNull(form.pregnancy_check_date || form.pd_check_date),
    expected_delivery_date: emptyToNull(form.expected_delivery_date),
    calving_date: form.calving_date || form.calved_date || today(),
    veterinarian: emptyToNull(form.vet_name || form.veterinarian),
    calf_count: form.calf_count ? parseInt(form.calf_count, 10) : 1,
    calf_gender: capitalize(form.calf_gender) || 'Female',
    calf_weight: emptyToNull(form.calf_weight),
    delivery_type: capitalize(form.delivery_type) || 'Normal',
    assistance: normalizeAssistance(form.assistance),
    dam_condition: capitalize(form.dam_condition) || 'Healthy',
    calf_condition: capitalize(form.calf_condition) || 'Healthy',
    remarks: emptyToNull(form.remarks),
  };
}

export function calvedFromRecord(r) {
  const paid =
    r.paid === 'Yes' || r.paid === 'yes' || r.paid === true || r.paid === 1 ? 'yes' : 'no';
  const methodRaw = String(r.breeding_method || r.method || 'Natural').toLowerCase();
  const method = methodRaw.includes('artificial') ? 'artificial' : 'natural';
  const assistance =
    r.assistance === 'Yes' || r.assistance === 'yes' ? 'yes' : 'no';

  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    health_issue_date: r.health_issue_date || '',
    doctor_name: r.doctor_name || '',
    symptoms: r.symptoms || '',
    remedy_taken: r.remedy_taken || '',
    remedy_suggested: r.remedy_suggested || '',
    estimated_cost: r.estimated_cost ?? '',
    doctor_charges: r.doctor_charges ?? '',
    paid,
    breeding_date: r.breeding_date || '',
    method,
    sire_info: r.sire_info || '',
    breeding_notes: r.breeding_notes || '',
    pregnancy_check_date: r.pd_check_date || r.pregnancy_check_date || '',
    expected_delivery_date: r.expected_delivery_date || '',
    calving_date: r.calving_date || r.calved_date || today(),
    vet_name: r.veterinarian || r.vet_name || '',
    calf_count: r.calf_count != null ? String(r.calf_count) : '1',
    calf_gender: (r.calf_gender || 'female').toLowerCase(),
    calf_weight: r.calf_weight ?? '',
    delivery_type: (r.delivery_type || 'normal').toLowerCase(),
    assistance,
    dam_condition: (r.dam_condition || 'healthy').toLowerCase(),
    calf_condition: (r.calf_condition || 'healthy').toLowerCase(),
    remarks: r.remarks || '',
  };
}
