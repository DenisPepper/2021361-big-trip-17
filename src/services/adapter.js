import { DEFAULT_POINT_TYPE } from '../settings';
import { isFuture, isPast } from './filter';

const getTotalPrice = (point, offers) => {
  const cost = offers
    .filter((element) => element.type === point.type)
    .pop()
    .offers
    .reduce((i, offer) => {
      if (point.offers.includes(offer.id)) {
        i += offer.price;
      }
    }, 0);
  return point.base_price + cost;
};

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

  PointForClient = (point, offers) => ({
    totalPrice: getTotalPrice(point, offers),
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    destination: point.destination,
    id: point.id,
    isFavorite: point.is_favorite,
    offers: point.offers,
    type: point.type,
    isFuture: isFuture({dateFrom: point.date_from, dateTo: point.date_to}),
    isPast: isPast({dateFrom: point.date_from, dateTo: point.date_to}),
  });

  getNewPoint = () => ({
    basePrice: 0,
    dateFrom: '',
    dateTo: '',
    destination: null,
    isFavorite: false,
    offers: [],
    type: DEFAULT_POINT_TYPE,
    isNew: true,
  });
}
