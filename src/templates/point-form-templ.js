import { POINT_TYPES } from '../const';
import { firstCharToUpperCase, formatDateTimePointForm } from '../util';

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

const getOffersList = (typeOffersObject, pointOffers) => {
  let result = '';
  typeOffersObject.offers.forEach((offer) => {
    const checked = pointOffers.includes(offer.id) ? 'checked' : '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${checked}>
    <label class="event__offer-label" for="event-offer-${offer.id}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });
  return result;
};

const getPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

export const createPointFormTempalte = (point, offers, destinations) => {
  const destination = destinations[point.destination];
  const typeOffersObject = offers
    .filter((element) => element.type === point.type)
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
      value="${destination.name}"
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
      value="${formatDateTimePointForm(point.dateFrom)}"
    />&mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input
      class="event__input event__input--time"
      id="event-end-time-1" type="text"
      name="event-end-time"
      value="${formatDateTimePointForm(point.dateTo)}"
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
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${getOffersList(typeOffersObject, point.offers)}
    </div>
  </section>

  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
    <div class="event__photos-tape">
    ${getPictures(destination.pictures)}
     </div>
   </div>
  </section>
</section>
</form>`;
};
