import dayjs from 'dayjs';
import { HOUR, DAY } from './const';

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
  const interval =
    parseInt(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'), 10);
  if (interval < HOUR) {
    return dayjs().minute(interval).format('mm[M]');
  } else if (interval >= HOUR && interval < DAY) {
    return dayjs().minute(interval).format('HH[H] mm[M]');
  } else if (interval >= DAY) {
    return dayjs().minute(interval).format('DD[D] HH[H] mm[M]');
  }
};
