const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}

export function validateTime(timeStr: string): boolean {
  return TIME_REGEX.test(timeStr);
}

export function checkUnknownFields(body: any, allowedKeys: string[]): string[] {
  const keys = Object.keys(body);
  const allowedSet = new Set(allowedKeys);
  return keys.filter(key => !allowedSet.has(key));
}
