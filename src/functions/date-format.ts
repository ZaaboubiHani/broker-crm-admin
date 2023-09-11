export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateToYYYYMM(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export function formatDateToMM(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${month}`;
}

export function formatDateToYYYY(date: Date): string {
  const year = date.getFullYear();
  return `${year}`;
}