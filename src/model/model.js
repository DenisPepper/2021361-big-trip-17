import { getDemoPoint, getDemoOffers, getDemoDestinations } from '../mock/mock';
import { POINTS_COUNT } from '../settings';

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
}
