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
  #data = getMock();
  get data() {
    return this.#data;
  }
}