export const readingFields = ['meter_number', 'meter_value_S', 'meter_value_1', 'meter_value_2', 'meter_value_3'];
export const readingsContact = { phone: '+7 (4217) 54-96-54', href: 'tel:+74217549654', original: '/internet-priemnaya' };

export function readingPeriod(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Vladivostok', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const part = type => Number(parts.find(x => x.type === type).value);
  const year = part('year'), month = part('month'), day = part('day');
  const date = new Date(Date.UTC(year, month - 1, 20));
  const nextDate = new Date(Date.UTC(year, month - 1 + (day > 25 ? 1 : 0), 20));
  return {
    open: day >= 20 && day <= 25,
    day,
    monthLabel: new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date),
    nextOpenLabel: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(nextDate),
    timeZone: 'Asia/Vladivostok'
  };
}

export function validateReadings(input) {
  const values = {}, errors = {};
  for (const field of readingFields) {
    const raw = input?.[field];
    const value = typeof raw === 'string' ? raw.trim() : '';
    const required = field === 'meter_number' || field === 'meter_value_S';
    values[field] = value;
    if (required && !value) errors[field] = field === 'meter_number' ? 'Укажите заводской номер счётчика.' : 'Укажите общие показания счётчика.';
    else if ((raw != null && typeof raw !== 'string') || (value && !/^[0-9]+$/.test(value))) errors[field] = 'Введите только цифры, без пробелов, запятых и точек.';
    else if (value.length > 64) errors[field] = 'Проверьте значение: оно слишком длинное.';
  }
  return { values, errors, valid: Object.keys(errors).length === 0 };
}
