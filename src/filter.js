import { FilterSettings } from './settings';
import dayjs from 'dayjs';

const nullPredicate = () => true;

const getRule = (filter, currentDate) => {
  const filterRule = FilterSettings[filter];
  return filterRule === undefined ? nullPredicate : filterRule(currentDate);
};

export const filtrate = (filter, points, currentDate = dayjs()) =>
  points.filter(getRule(filter, currentDate));
