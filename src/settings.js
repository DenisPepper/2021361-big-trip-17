import dayjs from 'dayjs';
import { getDateDiffInMinute } from './util';

export const POINTS_COUNT = 3;
export const DECIMAL = 10;
export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 1440;
export const DEFAULT_DELAY = 500;
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
export const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
export const FilterRules = {
  [Filters.FUTURE]: (currentDate) => (point) => currentDate.isBefore(dayjs(point.dateFrom)) || currentDate.isBefore(dayjs(point.dateTo)),
  [Filters.PAST]: (currentDate) => (point) => currentDate.isAfter(dayjs(point.dateTo)) || currentDate.isAfter(dayjs(point.dateFrom)),
};
export const NoPointsMessages = {
  [Filters.FUTURE] : 'There are no future events now',
  [Filters.PAST] : 'There are no past events now',
};
export const Sorts = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const SorterRules = {
  [Sorts.PRICE] : (a, b) => b.basePrice - a.basePrice,
  [Sorts.TIME] : (a, b) => getDateDiffInMinute(b.dateFrom, b.dateTo) - getDateDiffInMinute(a.dateFrom, a.dateTo),
  [Sorts.DAY] : (a, b) => dayjs(b.dateFrom) - (dayjs(a.dateFrom)),
};


