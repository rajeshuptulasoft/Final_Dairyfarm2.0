import { animalsAPI } from '../services/api';

export const initialAnimalForm = {
  name: '',
  tag_number: '',
  breed: '',
  animal_type: '',
  gender: 'female',
  date_of_birth: '',
  farm_entry_date: '',
  purchase_date: '',
  purchase_price: '',
  status: 'active',
  weight: '',
  remarks: '',
  color: '',
  milking_now: 'Yes',
  is_calf: 'No',
  source: '',
  health_status: 'healthy',
  pregnancy_status: 'not_pregnant',
  image_url: '',
};

export function toYesNo(val, def = 'No') {
  if (val === true || val === 'Yes' || val === 'yes' || val === 1 || val === '1') return 'Yes';
  if (val === false || val === 'No' || val === 'no' || val === 0 || val === '0') return 'No';
  return def;
}

export function animalFromRecord(a) {
  return {
    name: a.name || '',
    tag_number: a.tag_number || '',
    breed: a.breed || '',
    animal_type: a.animal_type || '',
    gender: a.gender || 'female',
    date_of_birth: a.date_of_birth || '',
    purchase_date: a.purchase_date || '',
    farm_entry_date: a.farm_entry_date || a.purchase_date || '',
    purchase_price: a.purchase_price ?? '',
    weight: a.weight ?? '',
    color: a.color || '',
    milking_now: toYesNo(a.milking_now, 'Yes'),
    is_calf: toYesNo(a.is_calf, 'No'),
    remarks: a.remarks || '',
    status: a.status || 'active',
    source: a.source || '',
    health_status: a.health_status || 'healthy',
    pregnancy_status: a.pregnancy_status || 'not_pregnant',
    image_url: a.image_url || '',
  };
}

export function buildAnimalPayload(form) {
  const farmEntry = (form.farm_entry_date || '').trim();
  const emptyToNull = (v) => {
    if (v === '' || v === undefined || v === null) return null;
    return v;
  };

  return {
    name: form.name.trim(),
    tag_number: form.tag_number.trim(),
    breed: form.breed.trim(),
    gender: form.gender,
    date_of_birth: emptyToNull(form.date_of_birth),
    farm_entry_date: emptyToNull(farmEntry),
    purchase_date: emptyToNull(form.purchase_date?.trim() || farmEntry),
    purchase_price: form.purchase_price !== '' && form.purchase_price != null ? Number(form.purchase_price) : null,
    status: form.status || 'active',
    weight: form.weight !== '' && form.weight != null ? Number(form.weight) : null,
    remarks: emptyToNull(form.remarks?.trim()),
    animal_type: emptyToNull(form.animal_type),
    color: emptyToNull(form.color?.trim()),
    milking_now: form.milking_now,
    is_calf: form.is_calf,
    source: emptyToNull(form.source?.trim()),
    health_status: form.health_status || 'healthy',
    pregnancy_status: form.pregnancy_status || 'not_pregnant',
    image_url: emptyToNull(form.image_url),
  };
}

export async function submitAnimal({ form, imageFile, editingId }) {
  let imageUrl = form.image_url || '';

  if (imageFile) {
    const uploadRes = await animalsAPI.uploadImage(imageFile);
    imageUrl = uploadRes.data.image_url || uploadRes.data.url || '';
  }

  const payload = buildAnimalPayload({ ...form, image_url: imageUrl });

  if (editingId) {
    return animalsAPI.update(editingId, payload);
  }
  return animalsAPI.create(payload);
}
