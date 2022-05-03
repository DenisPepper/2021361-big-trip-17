import { getDemoPoint, getDemoOffers, getDemoDestinations } from '../mock/mock';
import { POINTS_COUNT } from '../const';

const getMock = () => {
  const mock = new Map();
  mock.set(
    'points',
    Array.from({ length: POINTS_COUNT }, (element, index) =>
      getDemoPoint(index)
    )
  );
  mock.set('offers', getDemoOffers());
  mock.set('destinations', getDemoDestinations());
  return mock;
};

export default class PointModel {
  _mock = getMock();
  get mock() {
    return this._mock;
  }
}
