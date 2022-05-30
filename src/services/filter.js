import dayjs from 'dayjs';
import { Filters } from '../settings';
import { FilterRules } from '../settings';

const NULL_PREDICATE = () => true;

class Rules {
  currentDate = dayjs();

  get [Filters.FUTURE]() {
    return FilterRules[Filters.FUTURE](this.currentDate);
  }

  get [Filters.PAST]() {
    return FilterRules[Filters.PAST](this.currentDate);
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
