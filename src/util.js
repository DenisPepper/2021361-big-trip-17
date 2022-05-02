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
