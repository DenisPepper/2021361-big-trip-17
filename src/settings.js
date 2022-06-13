import dayjs from 'dayjs';
import { getDateDiffInMinute } from './util';
import { Filters } from './services/filter';

export const DECIMAL = 10;
export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 1440;
export const DEFAULT_DELAY = 1000;
export const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];
export const DEFAULT_POINT_TYPE = 'taxi';
export const Messages = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.FUTURE]: 'There are no future events now',
  [Filters.PAST]: 'There are no past events now',
  LOADING: 'Loading ...',
  RESTART: 'Server error. Please, try again later',
};
export const Sorts = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};
export const SorterRules = {
  [Sorts.PRICE]: (a, b) => b.basePrice - a.basePrice,
  [Sorts.TIME]: (a, b) => getDateDiffInMinute(b.dateFrom, b.dateTo) - getDateDiffInMinute(a.dateFrom, a.dateTo),
  [Sorts.DAY]: (a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom),
};
export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
