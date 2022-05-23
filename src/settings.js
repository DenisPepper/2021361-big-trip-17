import dayjs from 'dayjs';

export const POINTS_COUNT = 3;
export const DECIMAL = 10;
export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 1440;
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
export const filterSettings = {
  [Filters.FUTURE]: (currentDate) => (point) => currentDate.isBefore(dayjs(point.dateFrom)) || currentDate.isBefore(dayjs(point.dateTo)),
  [Filters.PAST]: (currentDate) => (point) => currentDate.isAfter(dayjs(point.dateTo)) || currentDate.isAfter(dayjs(point.dateFrom)),
};
