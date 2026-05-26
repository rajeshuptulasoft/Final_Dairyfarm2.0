const today = () => new Date().toISOString().slice(0, 10);

const baseBreedingForm = {
  animal_id: '',
  breeding_date: '',
  method: 'natural',
  sire_info: '',
  notes: '',
};

export function getInitialBreedingForm() {
  return { ...baseBreedingForm, breeding_date: today() };
}

const emptyToNull = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  return v;
};

const normalizeMethod = (method) => {
  const m = String(method || '').toLowerCase();
  if (m === 'artificial' || m === 'artificial insemination') return 'Artificial Insemination';
  if (m === 'natural') return 'Natural';
  return method || 'Natural';
};

export function buildBreedingPayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    breeding_date: form.breeding_date,
    method: normalizeMethod(form.method),
    sire_info: emptyToNull(form.sire_info),
    notes: emptyToNull(form.notes),
  };
}

export function breedingFromRecord(r) {
  const methodRaw = String(r.method || 'Natural').toLowerCase();
  const method = methodRaw.includes('artificial') ? 'artificial' : 'natural';
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    breeding_date: r.breeding_date || today(),
    method,
    sire_info: r.sire_info || '',
    notes: r.notes || '',
  };
}
