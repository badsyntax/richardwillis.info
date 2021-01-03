/* eslint-disable @typescript-eslint/ban-ts-comment */

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
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/35865
    dateStyle: 'full',
  });
}

export function getFormattedDateShort(date: Date): string {
  return getFormattedDate(date, {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/35865
    dateStyle: 'short',
  });
}

export function getFormattedDateMedium(date: Date): string {
  return getFormattedDate(date, {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/35865
    dateStyle: 'long',
  });
}
