import { Sorts } from '../settings';
import { SorterRules } from '../settings';

const DEFAULT_COMPARE = () => 0;

class Rules {
  get [Sorts.DAY]() {
    return SorterRules[Sorts.DAY];
  }

  get [Sorts.PRICE]() {
    return SorterRules[Sorts.PRICE];
  }

  get [Sorts.TIME]() {
    return SorterRules[Sorts.TIME];
  }
}

export default class Sorter {
  #ruleStorage = null;

  constructor(storage = Rules) {
    this.#ruleStorage = storage;
  }

  #getrRule = (sortName) => {
    const storage = new this.#ruleStorage();
    return storage[sortName] || DEFAULT_COMPARE;
  };

  run = (points, sortName) => points.sort(this.#getrRule(sortName));
}
