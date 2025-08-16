import { format, getTime, formatDistanceToNow } from 'date-fns';
import { number } from 'yup';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDateMDesc(month: string) {
  switch (month) {
    case '01':
      return 'يناير';
    case '02':
      return 'فبراير';
    case '03':
      return 'مارس';
    case '04':
      return 'ابريل';
    case '05':
      return 'مايو';
    case '06':
      return 'يونيو';
    case '07':
      return 'يوليو';
    case '08':
      return 'اغسطس';
    case '09':
      return 'سبتمبر';
    case '10':
      return 'اكتوبر';
    case '11':
      return 'نوفمبر';
    case '12':
      return 'ديسمبر';
    default:
      return '';
  }
}

export function fDateM(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'MM';

  return date ? format(new Date(date), fm) : '';
}

export function fDate_(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}
export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';
  const d = date ? format(new Date(date), fm) : '';
  return d;
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: false,
      })
    : '';
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}
