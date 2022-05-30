import { getDemoPoint, getDemoOffers, getDemoDestinations } from '../mock/mock';
import { POINTS_COUNT } from '../settings';
import Filter from '../services/filter';
import Sorter from '../services/sorter';
import Notifier from '../services/notifier';

const getMock = () => ({
  points: Array.from({ length: POINTS_COUNT }, (element, index) =>
    getDemoPoint(index)
  ),
  offers: getDemoOffers(),
  destinations: getDemoDestinations(),
});

export default class Model {
  #points = [];
  #offers = [];
  #destinations = [];
  #loaded = false;
  #filter = null;
  #sorter = null;

  constructor(args) {
    const { filter, sorter} = args;
    if (filter instanceof Filter) {
      this.#filter = filter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Filter}`);
    }
    if (sorter instanceof Sorter) {
      this.#sorter = sorter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Sorter}`);
    }
  }

  #getData = () => {
    if (this.#loaded) {
      return;
    }
    this.#loaded = true;
    const { points, offers, destinations } = getMock();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  };

  get points() {
    this.#getData();
    return this.#points;
  }

  get offers() {
    this.#getData();
    return this.#offers;
  }

  get destinations() {
    this.#getData();
    return this.#destinations;
  }

  filtrate = (filterName) => this.#filter.run(this.points, filterName);

  sorting = (points = this.points, sortName) =>
    this.#sorter.run(points, sortName);

}
