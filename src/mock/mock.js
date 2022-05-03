import { getRandomInteger } from '../util';

const PHOTO_COUNT = 100;
const MIN_PRICE = 10;
const MAX_PRICE = 100;
const POINT_TYPE = 'flight';
const POINT_NAME = 'Маршрутная точка (ДЕМО)';

const getPrice = () => getRandomInteger(MIN_PRICE, MAX_PRICE);

export const getDemoPoint = (index = 0) => ({
  basePrice: getPrice(),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: 0,
  id: index,
  isFavorite: false,
  offers: [1, 2],
  type: POINT_TYPE,
});

export const getDemoOffers = () => {
  const offers = [];
  offers.push({
    type: POINT_TYPE,
    offers: [
      { id: 1, title: 'Add luggage', price: 30 },
      { id: 2, title: 'Switch to comfort class', price: 100 },
      { id: 2, title: 'Add meal', price: 15 },
      { id: 2, title: 'Choose seats', price: 5 },
      { id: 2, title: 'Travel by train', price: 40 },
    ],
  });
  return offers;
};

export const getDemoDestinations = () => {
  const destinations = [];
  destinations.push({
    description:
      'Это невероятно классная маршрутная точка, которую точно стоит посетить с друзьями. Незабываемые впечатления и хорошее настроение гарантируется!',
    pointName: POINT_NAME,
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(
          0,
          PHOTO_COUNT
        )}`,
        description: 'это описание фотографии',
      },
    ],
  });
  return destinations;
};
