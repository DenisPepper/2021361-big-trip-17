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
  #notifier = null;

  constructor(args) {
    const { filter, sorter, notifier} = args;
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
    if (notifier instanceof Notifier) {
      this.#notifier = notifier;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Notifier}`);
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

  addPoint = (point) => {
    this.#points = [point, ...this.#points];
    this.#notifier.run();
  };

  deletePoint = (point) => {
    const index = this.#points.findIndex((element) => element.id === point.id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
    this.#notifier.run();
  };

  updatePoint = (point) => {
    const index = this.#points.findIndex((element) => element.id === point.id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [...this.#points.slice(0, index), point, ...this.#points.slice(index + 1)];
    this.#notifier.run();
  };

  filtrate = (filterName) => this.#filter.run(this.points, filterName);

  sorting = (points = this.points, sortName) => this.#sorter.run(points, sortName);

  #notify = () => {};

  addEvent = (callback) => this.#notifier.add(callback);

  removeEvent = (callback) => this.#notifier.remove(callback);

}
