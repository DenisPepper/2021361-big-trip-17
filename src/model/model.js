import { getDemoPoint, getDemoOffers, getDemoDestinations } from '../mock/mock';
import { POINTS_COUNT } from '../const';

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
  static #instance;

  static create() {
    if (!this.#instance) {
      this.#instance = new Model();
    }
    return this.#instance;
  }

  constructor() {
    if (Model.#instance) {
      throw new Error('can not use multiple instances of a class');
    }
  }

  getData = () => {
    const { points, offers, destinations } = getMock();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  };

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
