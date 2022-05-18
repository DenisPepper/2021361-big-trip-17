import { Filters } from './const';
import dayjs from 'dayjs';

export default class Filter {
  static run = (filter, points) => {
    let result = [];
    const currentDate = dayjs();
    switch (filter) {
      case Filters.EVERYTHING:
        result = points;
        break;
      case Filters.FUTURE:
        result = points.filter(
          (point) =>
            currentDate.isBefore(dayjs(point.dateFrom)) ||
            currentDate.isBefore(dayjs(point.dateTo))
        );
        break;
      case Filters.PAST:
        result = points.filter(
          (point) =>
            currentDate.isAfter(dayjs(point.dateTo)) ||
            currentDate.isAfter(dayjs(point.dateFrom))
        );
        break;
    }
    return result;
  };
}
