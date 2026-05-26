const today = () => new Date().toISOString().split('T')[0];

export const TIME_OF_DAY_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night'];
export const UNIT_OPTIONS = ['Kg', 'L'];

export function getInitialDailyFoodForm() {
  return {
    food_date: today(),
    tag_number: '',
    animal_id: '',
    animal_name: '',
    time_of_day: 'Morning',
    item_id: '',
    item_name: '',
    quantity: '',
    unit: 'Kg',
    remarks: '',
  };
}

export function buildDailyFoodPayload(form) {
  const payload = {
    animal_id: parseInt(form.animal_id, 10),
    food_date: form.food_date,
    quantity: parseFloat(form.quantity),
    unit: form.unit || 'Kg',
    time_of_day: form.time_of_day,
    remarks: form.remarks || null,
  };

  if (form.item_id) {
    payload.item_id = parseInt(form.item_id, 10);
  }
  if (form.item_name) {
    payload.item_name = form.item_name;
  }

  return payload;
}
