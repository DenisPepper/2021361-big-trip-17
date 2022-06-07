import { getCurrentDateTime } from '../util';
import { DEFAULT_POINT_TYPE } from '../settings';

export default class Adapter {
  pointForServer = (point) => {
    const {basePrice, dateFrom, dateTo, destination, id, isFavorite, offers, type} = point;
    return {
      ['base_price']: basePrice,
      ['date_from']: dateFrom,
      ['date_to']: dateTo,
      destination: destination,
      id: id,
      ['is_favorite']: isFavorite,
      offers: offers,
      type: type
    };
  };

  PointForClient = (point) => ({
    basePrice : point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    destination: point.destination,
    id: point.id,
    isFavorite: point.is_favorite,
    offers: point.offers,
    type: point.type
  });

  getNewPoint = () => ({
    basePrice: 0,
    dateFrom: getCurrentDateTime(),
    dateTo: getCurrentDateTime(),
    destination: null,
    isFavorite: false,
    offers: [],
    type: DEFAULT_POINT_TYPE,
    isNew: true,
  });
}
