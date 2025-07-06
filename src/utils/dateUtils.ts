export function parseDate(dateString: string): Date {
  // Handle different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];

  if (formats[0].test(dateString)) {
    return new Date(dateString);
  } else if (formats[1].test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  } else if (formats[2].test(dateString)) {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  } else if (formats[3].test(dateString)) {
    return new Date(dateString);
  }

  return new Date(dateString);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getDayOfWeek(date: Date): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function getMonthName(date: Date): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[date.getMonth()];
}

export function getQuarter(date: Date): number {
  return Math.ceil((date.getMonth() + 1) / 3);
}

export function getSemester(date: Date): number {
  return date.getMonth() < 6 ? 1 : 2;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return date >= weekStart && date <= weekEnd;
}

export function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}