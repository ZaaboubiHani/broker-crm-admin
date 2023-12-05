export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function calculateDaysBetweenDates(date1: Date | null | undefined, date2: Date | null | undefined): number {
  if (date1 && date2) {

    const timeDifference = Math.abs(date2.getTime() - date1.getTime());

    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
  }
  return 0;
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

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Ensure that the hours and minutes are always two digits
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHours}:${formattedMinutes}`;
}