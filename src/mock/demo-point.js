import { getRandomInteger } from '../util';
import { MAX_PRICE, MIN_PRICE, POINT_TYPES, PHOTO_COUNT } from '../const';

const getPrice = () => getRandomInteger(MIN_PRICE, MAX_PRICE);

const getDestination = () => ({
  description:
    'Это невероятно классная маршрутная точка, которую точно стоит посетить с друзьями. Незабываемые впечатления и хорошее настроение гарантируется!',
  pointName: 'Маршрутная точка',
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(0, PHOTO_COUNT)}`,
      description: 'это описание фотографии',
    },
  ],
});

const getOffers = () => {
  const offers = [];
  return offers;
};

const getType = () => POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];

export const getDemoPoint = (index = 0) => {
  const type = getType();
  return {
    basePrice: getPrice(),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: getDestination(),
    id: index,
    isFavorite: false,
    offers: getOffers(),
    type,
  };
};
