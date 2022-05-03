import { getRandomInteger } from '../util';
import { MAX_PRICE, MIN_PRICE, POINT_TYPE} from './demo-const';

const getPrice = () => getRandomInteger(MIN_PRICE, MAX_PRICE);

export const getDemoPoint = (count = 0) => ({
  basePrice: getPrice(),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: 0,
  id: count,
  isFavorite: false,
  offers: [1, 2],
  type: POINT_TYPE,
});
