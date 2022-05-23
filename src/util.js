import dayjs from 'dayjs';
import { MINUTES_IN_HOUR, MINUTES_IN_DAY, DECIMAL } from './settings';

export const getRandomInteger = (min, max) => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('один из параметров не является целым числом');
  }
  if (min < 0 || max <= min) {
    throw new Error(
      'параметры не удовлетворяют условиям: min, max > 0, max > min'
    );
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const firstCharToUpperCase = (string) => {
  if (string.length === 0) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

export const formatDateTimePointForm = (date) =>
  dayjs(date).format('DD/MM/YY HH:mm');

export const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

export const formatDateTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');

export const formaTime = (date) => dayjs(date).format('HH:mm');

export const getDayOf = (date) => dayjs(date).format('MMM D');

export const getTimeInterval = (dateFrom, dateTo) => {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let format = '';
  const interval = parseInt(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'), DECIMAL);
  if (interval < MINUTES_IN_HOUR) {
    hours = interval;
    format = 'mm[M]';
  } else if (interval >= MINUTES_IN_HOUR && interval < MINUTES_IN_DAY) {
    hours = Math.floor(interval / MINUTES_IN_HOUR);
    minutes = interval - hours * MINUTES_IN_HOUR;
    format = 'HH[H] mm[M]';
  } else if (interval >= MINUTES_IN_DAY) {
    days = Math.floor(interval / MINUTES_IN_DAY);
    hours = Math.floor((interval - days * MINUTES_IN_DAY) / MINUTES_IN_HOUR);
    minutes = interval - days * MINUTES_IN_DAY - hours * MINUTES_IN_HOUR;
    format = 'DD[D] HH[H] mm[M]';
  }
  return dayjs()
    .set('year', 0)
    .set('month', 0)
    .set('date', days)
    .set('hour', hours)
    .set('minute', minutes)
    .format(format);
};
