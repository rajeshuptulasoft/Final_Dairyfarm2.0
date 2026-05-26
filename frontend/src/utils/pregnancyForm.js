const today = () => new Date().toISOString().slice(0, 10);

const basePregnancyForm = {
  animal_id: '',
  pd_date: '',
  calv_due_date: '',
};

export function getInitialPregnancyForm() {
  return { ...basePregnancyForm, pd_date: today() };
}

export function buildPregnancyPayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    pd_date: form.pd_date || form.pregnancy_check_date || today(),
    calv_due_date: form.calv_due_date || form.expected_delivery_date || '',
  };
}

export function pregnancyFromRecord(r) {
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    pd_date: r.pd_date || r.pregnancy_check_date || today(),
    calv_due_date: r.calv_due_date || r.expected_delivery_date || '',
  };
}
