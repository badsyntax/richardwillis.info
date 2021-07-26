import getConfig from 'next/config';

const { locale } = getConfig().publicRuntimeConfig;

export function getFormattedDate(
  date: Date,
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function getFormattedDateLong(date: Date): string {
  return getFormattedDate(date, {
    dateStyle: 'full',
  });
}

export function getFormattedDateShort(date: Date): string {
  return getFormattedDate(date, {
    dateStyle: 'short',
  });
}

export function getFormattedDateMedium(date: Date): string {
  return getFormattedDate(date, {
    dateStyle: 'long',
  });
}
