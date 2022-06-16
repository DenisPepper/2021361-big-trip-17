import dayjs from 'dayjs';
import { MINUTES_IN_HOUR, MINUTES_IN_DAY, DECIMAL, DEFAULT_DELAY } from './settings';

export const firstCharToUpperCase = (string) => {
  if (string.length === 0) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

export const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

export const formatDateTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');

export const formaTime = (date) => dayjs(date).format('HH:mm');

export const getDayOf = (date) => dayjs(date).format('MMM D');

export const getDateDiffInMinute = (dateFrom, dateTo) => parseInt(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'), DECIMAL);

export const getTimeInterval = (dateFrom, dateTo) => {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let format = '';
  const interval = getDateDiffInMinute(dateFrom, dateTo);
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

export const debounce = (callback, delay = DEFAULT_DELAY) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, rest), delay);
  };
};
