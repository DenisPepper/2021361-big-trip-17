import { POINT_TYPES } from '../settings';
import { firstCharToUpperCase } from '../util';

const getEventTypeList = (pointType = '') => {
  let result = '';
  POINT_TYPES.forEach((type) => {
    const checked = type === pointType ? 'checked' : '';
    result += `<div class="event__type-item">
              <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" 
              name="event-type" value="${type}" ${checked}>
              <label class="event__type-label event__type-label--${type}" 
              for="event-type-${type}-1">${firstCharToUpperCase(type)}</label>
            </div>`;
  });
  return result;
};

const getDestinationsList = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result += `<option value="${destination.name}"></option>`;
  });
  return result;
};

const getOffersList = (offerTypeObject, pointOffers) => {
  let result = '';
  offerTypeObject.offers.forEach((offer) => {
    const checked = pointOffers.includes(offer.id) ? 'checked' : '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });
  return result;
};

const getOffersSection = (point, offerTypeObject) => {
  const result = `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${getOffersList(offerTypeObject, point.offers)}
    </div>
  </section>`;
  return result;
};

const getPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

const getPicturesContainer = (pictures) => {
  const result =  pictures.length === 0 ? '' : `<div class="event__photos-container">
  <div class="event__photos-tape"> 
   ${getPictures(pictures)}
  </div>
  </div>`;
  return result;
};

const getDestinationSection = (destination) => {
  const result = `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
  ${getPicturesContainer(destination.pictures)}  
  </section>`;
  return result;
};

export const createPointFormTempalte = (point, offers, destinations) => {
  const destination = point.destination;
  const offerTypeObject = offers
    .filter((offer) => offer.type === point.type)
    .pop();

  return `<form class="event event--edit" action="#" method="post">

  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17"
      src="img/icons/${point.type}.png" alt="Event type icon" />
    </label>
    <input
      class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox"
    />

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${getEventTypeList(point.type)}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group event__field-group--destination">
    <label class="event__label event__type-output" for="event-destination-1">
      ${point.type}</label
    >
    <input
      class="event__input event__input--destination"
      id="event-destination-1" type="text" name="event-destination"
      value="${destination === null ? '' : destination.name}"
      list="destination-list-1"
    />
    <datalist id="destination-list-1">
      ${getDestinationsList(destinations)}
    </datalist>
  </div>

  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input
      class="event__input event__input--time"
      id="event-start-time-1" type="text"
      name="event-start-time"
      value="${point.dateFrom}"
    />&mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input
      class="event__input event__input--time"
      id="event-end-time-1" type="text"
      name="event-end-time"
      value="${point.dateTo}"
    />
  </div>

  <div class="event__field-group event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input
      class="event__input event__input--price"
      id="event-price-1" type="text" name="event-price"
      value="${[point.basePrice]}"
    />
  </div>

  <button class="event__save-btn btn btn--blue" type="submit">Save</button>

  <button class="event__reset-btn" type="reset">Delete</button>

  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</header>

  <section class="event__details">
  
  ${offerTypeObject.offers.length === 0 ? '' : getOffersSection(point, offerTypeObject)}
  
  ${destination === null ? '' : getDestinationSection(destination)}
  
</section>
</form>`;
};
