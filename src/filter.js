import { Filters } from './const';
import dayjs from 'dayjs';

const nullPredicate = () => true;

const settings = {
  [Filters.FUTURE]: (currentDate) => (point) => currentDate.isBefore(dayjs(point.dateFrom)) || currentDate.isBefore(dayjs(point.dateTo)),
  [Filters.PAST]: (currentDate) => (point) => currentDate.isAfter(dayjs(point.dateTo)) || currentDate.isAfter(dayjs(point.dateFrom)),
};

const getFilterRule = (filter, currentDate) => {
  const filterRule = settings[filter];
  return filterRule === undefined ? nullPredicate : filterRule(currentDate);
};


export const getFilteredPoints = (filter, points, currentDate = dayjs()) =>
  points.filter(getFilterRule(filter, currentDate));
