import dayjs from 'dayjs';

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

export const formatDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');
