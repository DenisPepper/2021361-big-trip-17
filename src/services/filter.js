import dayjs from 'dayjs';

export const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const CURRENT_DATE = dayjs();

const BasicFilterRules  = {
  [Filters.FUTURE]: (currentDate) => (point) => currentDate.isBefore(dayjs(point.dateFrom)) || currentDate.isBefore(dayjs(point.dateTo)),
  [Filters.PAST]: (currentDate) => (point) => currentDate.isAfter(dayjs(point.dateTo)) || currentDate.isAfter(dayjs(point.dateFrom)),
};

const ReducedFilterRules = {
  [Filters.FUTURE]: () => (point) => point.isFuture,
  [Filters.PAST]: () => (point) => point.isPast,
};

export const isFuture = (point) => {
  const rule = BasicFilterRules[Filters.FUTURE](CURRENT_DATE);
  return rule(point);
};

export const isPast = (point) => {
  const rule = BasicFilterRules[Filters.PAST](CURRENT_DATE);
  return rule(point);
};

const NULL_PREDICATE = () => true;

class Rules {

  get [Filters.FUTURE]() {
    return ReducedFilterRules[Filters.FUTURE]();
  }

  get [Filters.PAST]() {
    return ReducedFilterRules[Filters.PAST]();
  }
}

export default class Filter {
  #ruleStorage = null;

  constructor(storage = Rules) {
    this.#ruleStorage = storage;
  }

  #getrRule = (filterName) => {
    const storage = new this.#ruleStorage();
    return storage[filterName] || NULL_PREDICATE;
  };

  run = (points, filterName) => points.filter(this.#getrRule(filterName));
}
