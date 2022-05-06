import { getRandomInteger } from '../util';
import { POINT_TYPES } from '../const';

const PHOTO_COUNT = 1000;
const PICTURE_COUNT = 3;
const PHOTO_URI = 'http://picsum.photos/248/152?r=';
const MIN_PRICE = 10;
const MAX_PRICE = 100;
const POINT_TYPE = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];
const DEST_DESC = 'This is a city in big country.';
const DEST_NAMES = ['Amsterdam', 'Geneva', 'Chamonix'];
const OFFERS_DESC = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
];

const getPrice = () => getRandomInteger(MIN_PRICE, MAX_PRICE);

export const getDemoOffers = () => {
  const offers = Array.from({ length: 1 }, () => ({
    type: POINT_TYPE,
    offers: Array.from({ length: OFFERS_DESC.length }, (element, index) => ({
      id: index + 1,
      title: OFFERS_DESC[index],
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    })),
  }));

  return offers;
};

export const getDemoDestinations = () => {
  const destinations = Array.from({ length: DEST_NAMES.length }, (element, index) => ({
    description: DEST_DESC,
    name: DEST_NAMES[index],
    pictures: Array.from({ length: PICTURE_COUNT }, () => ({
      src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
      description: 'description of this photo',
    })),
  }));
  return destinations;
};

export const getDemoPoint = (index = 0) => ({
  basePrice: getPrice(),
  dateFrom: '2022-05-01T22:55:56.845Z',
  dateTo: '2022-05-02T11:22:13.375Z',
  destination: getRandomInteger(0, DEST_NAMES.length - 1),
  id: index,
  isFavorite: false,
  offers: [1, 3],
  type: POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)],
});
