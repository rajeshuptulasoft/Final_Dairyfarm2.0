const today = () => new Date().toISOString().slice(0, 10);

const baseHeatForm = {
  animal_id: '',
  heat_date: '',
};

export function getInitialHeatForm() {
  return { ...baseHeatForm, heat_date: today() };
}

export function buildHeatPayload(form) {
  return {
    animal_id: parseInt(form.animal_id, 10),
    heat_date: form.heat_date,
  };
}

export function heatFromRecord(r) {
  return {
    animal_id: r.animal_id ? String(r.animal_id) : '',
    heat_date: r.heat_date || today(),
  };
}
