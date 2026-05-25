export interface ValidationResult {
  [field: string]: string | undefined;
}

export function validateRequired(value: string, fieldName: string): string | undefined {
  return value.trim() ? undefined : `${fieldName} es requerido`;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const pattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return pattern.test(value.trim()) ? undefined : 'Formato de email inválido';
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return 'El teléfono solo debe contener dígitos numéricos';
  if (trimmed.length !== 9) return 'El teléfono debe tener exactamente 9 dígitos';
  if (!trimmed.startsWith('9')) return 'El teléfono debe comenzar con 9';
  return undefined;
}

export function validatePositiveNumber(value: string, fieldName: string): string | undefined {
  if (!value.trim()) return `${fieldName} es requerido`;
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return `${fieldName} debe ser un número mayor o igual a 0`;
  return undefined;
}

export function hasErrors(errors: ValidationResult): boolean {
  return Object.values(errors).some((e) => e !== undefined);
}
