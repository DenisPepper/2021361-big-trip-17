import { getRandomInteger } from '../util';
import { POINT_TYPES } from '../const';

const PHOTO_COUNT = 1000;
const PHOTO_URI = 'http://picsum.photos/248/152?r=';
const MIN_PRICE = 10;
const MAX_PRICE = 100;
const POINT_TYPE = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];
const DESC = `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). 
Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`;

const getPrice = () => getRandomInteger(MIN_PRICE, MAX_PRICE);

export const getDemoOffers = () => {
  const offers = [];
  offers.push({
    type: POINT_TYPE,
    offers: [
      { id: 1, title: 'Add luggage', price: 30 },
      { id: 2, title: 'Switch to comfort class', price: 100 },
      { id: 3, title: 'Add meal', price: 15 },
      { id: 4, title: 'Choose seats', price: 5 },
      { id: 5, title: 'Travel by train', price: 40 },
    ],
  });
  return offers;
};

export const getDemoDestinations = () => {
  const destinations = [];
  destinations.push({
    description: DESC,
    name: 'Amsterdam',
    pictures: [
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
    ],
  });
  destinations.push({
    description: DESC,
    name: 'Geneva',
    pictures: [
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
    ],
  });
  destinations.push({
    description: DESC,
    name: 'Chamonix',
    pictures: [
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
      {
        src: `${PHOTO_URI}${getRandomInteger(0, PHOTO_COUNT)}`,
        description: 'description of this photo',
      },
    ],
  });
  return destinations;
};

export const getDemoPoint = (index = 0) => ({
  basePrice: getPrice(),
  dateFrom: '2022-05-01T22:55:56.845Z',
  dateTo: '2022-05-10T11:22:13.375Z',
  destination: getRandomInteger(0, getDemoDestinations().length - 1),
  id: index,
  isFavorite: false,
  offers: [1, 3],
  type: POINT_TYPE,
});
