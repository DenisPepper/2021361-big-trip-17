import { getCurrentDateTime } from '../util';
import { POINT_TYPES } from '../settings';

export default class Adapter {
  #destinations = null;

  pointsForClient = (points, destinations) => {
    this.#destinations = destinations;
    return points.map(this.#adaptPointForClient);
  };

  #adaptPointForClient = (point) => ({
    ...point,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    destination: this.#destinations.findIndex(
      (element) => element.name === point.destination.name
    ),
  });

  getNewPoint = () => ({
    basePrice: 0,
    dateFrom: getCurrentDateTime(),
    dateTo: getCurrentDateTime(),
    destination: -1,
    isFavorite: false,
    offers: [],
    type: POINT_TYPES[0],
    isNew: true,
  });
}
