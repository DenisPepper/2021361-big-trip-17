import dayjs from 'dayjs';
import { getDateDiffInMinute } from './util';

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
export const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
export const FilterRules = {
  [Filters.FUTURE]: (currentDate) => (point) =>
    currentDate.isBefore(dayjs(point.dateFrom)) ||
    currentDate.isBefore(dayjs(point.dateTo)),
  [Filters.PAST]: (currentDate) => (point) =>
    currentDate.isAfter(dayjs(point.dateTo)) ||
    currentDate.isAfter(dayjs(point.dateFrom)),
};
export const Messages = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.FUTURE]: 'There are no future events now',
  [Filters.PAST]: 'There are no past events now',
  LOADING: 'Loading ...',
  RELOAD: 'Server error. Please, try again later',
};
export const Sorts = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const SorterRules = {
  [Sorts.PRICE]: (a, b) => b.basePrice - a.basePrice,
  [Sorts.TIME]: (a, b) =>
    getDateDiffInMinute(b.dateFrom, b.dateTo) -
    getDateDiffInMinute(a.dateFrom, a.dateTo),
  [Sorts.DAY]: (a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom),
};
