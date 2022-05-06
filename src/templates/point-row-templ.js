import {
  firstCharToUpperCase,
  formatDate,
  formaTime,
  formatDateTime,
  getDayOf,
  getTimeInterval,
} from '../util';

const getOffersList = (typeOffersObject, pointOffers) => {
  let result = '';
  typeOffersObject.offers.forEach((offer) => {
    if (pointOffers.includes(offer.id)) {
      result += ` <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
      </li>`;
    }
  });
  return result;
};

const isFavorite = (favorite) =>
  favorite ? 'event__favorite-btn--active' : '';

export const createPointRowTemplate = (point, offers, destinations) => {
  const destination = destinations[point.destination];
  const typeOffersObject = offers
    .filter((element) => element.type === point.type)
    .pop();
  return `
  <li class="trip-events__item">
    <div class="event">
    <time class="event__date" 
    datetime="${formatDate(point.dateFrom)}">${getDayOf(point.dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" 
      src="img/icons/${point.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${firstCharToUpperCase(point.type)}
     ${destination.name}</h3>
    <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" 
      datetime="${formatDateTime(point.dateFrom)}">
      ${formaTime(point.dateFrom)}</time>
      &mdash;
      <time class="event__end-time" 
      datetime="${formatDateTime(point.dateTo)}">
      ${formaTime(point.dateTo)}</time>
    </p>
    <p class="event__duration">
    ${getTimeInterval(point.dateFrom, point.dateTo)}</p>
    </div>
    <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${[point.basePrice]}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${typeOffersObject === undefined ? '' : getOffersList(typeOffersObject, point.offers)}
    </ul>
    <button class="event__favorite-btn 
    ${isFavorite(point.isFavorite)}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
    </button>
    <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
    </button>
    </div>
  </li>`;
};
