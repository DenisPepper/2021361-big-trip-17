import { createPointFormTempalte } from '../templates/point-form-templ';
import { debounce } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/material_blue.css';
import { DECIMAL } from '../settings';

const Delay = {
  POINT_TYPE: 200,
  DEST: 500,
};

const flatpickrSettings = {
  enableTime: true,
  altInput: true,
  altFormat: 'd/m/y H:i',
  dateFormat: 'Z',
  'locale': Russian,
  defaultHour: 8,
};

export default class PointForm extends AbstractStatefulView {
  _state;
  #offers = null;
  #destinations = null;
  _callback = {
    closeClick: () => {},
    saveClick: () => {},
    resetClick: () => {},
  };

  #rollupButton = null;
  #resetButton = null;
  #eventTypeGroup = null;
  #eventDestination = null;
  #eventStartTime = null;
  #eventEndTime = null;
  #flatpickrEndTime = null;
  #price = null;

  constructor(point, offers, destinations) {
    super();
    this.state = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.#findElements();
    this.#setHandlers();
    this.#setFlatpickr();
    this.#resetButton.disabled = this._state.isNew;
    this.#eventDestination.placeholder = 'choose destination';
  };

  #findElements = () => {
    this.#resetButton = this.element.querySelector('.event__reset-btn');
    this.#eventStartTime = this.element.querySelector('#event-start-time-1');
    this.#eventEndTime = this.element.querySelector('#event-end-time-1');
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#eventTypeGroup = this.element.querySelector('.event__type-list');
    this.#eventDestination = this.element.querySelector('.event__input--destination');
    this.#price = this.element.querySelector('#event-price-1');
  };

  #setHandlers = () => {
    this.element.addEventListener('submit', this.#saveClickHandler);
    this.element.addEventListener('reset', this.#resetClickHandler);
    this.#eventTypeGroup.addEventListener('input', this.#inputPointTypeHandler);
    this.#eventDestination.addEventListener('input', this.#inputDestinationHandler);
    this.#rollupButton.addEventListener('click', this.#closeClickHandler);
    this.#eventStartTime.addEventListener('input', this.#inputStartTimeHandler);
    this.#eventEndTime.addEventListener('input', this.#inputEndtTimeHandler);
    this.#price.addEventListener('input', this.#inputPriceHandler);
  };

  #setFlatpickr = () => {
    flatpickr(this.#eventStartTime, flatpickrSettings);
    this.#flatpickrEndTime = flatpickr(this.#eventEndTime, {...flatpickrSettings, minDate: this._state.dateFrom});
  };

  _restoreHandlers = () => {
    this.init();
  };

  get state() {
    const point = { ...this._state };
    return point;
  }

  set state(point) {
    this._state = { ...point };
  }

  resetState = (point) => {
    this.state = point;
    this.updateElement(this._state);
  };

  get template() {
    return createPointFormTempalte(
      this._state,
      this.#offers,
      this.#destinations
    );
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
  };

  setSaveClickHandler = (callback) => {
    this._callback.saveClick = callback;
  };

  setResetClickHandler = (callback) => {
    this._callback.resetClick = callback;
  };

  #closeClickHandler = () => {
    this._callback.closeClick();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveClick(this._state);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.resetClick(this.state);
  };

  #inputPointTypeHandler = debounce((evt) => {
    this.updateElement({ type: evt.target.value, offers: []});
  }, Delay.POINT_TYPE);

  #inputDestinationHandler = debounce((evt) => {
    const destination = this.#destinations.find(
      (element) => element.name === evt.target.value
    );
    if (destination) {
      this.updateElement({ destination });
    }
  }, Delay.DEST);

  #inputStartTimeHandler = debounce((evt) => {
    this._state.dateFrom = evt.target.value;
    this.#flatpickrEndTime.set('minDate', this._state.dateFrom);
  });

  #inputEndtTimeHandler = debounce((evt) => {
    this._state.dateTo = evt.target.value;
  });

  #inputPriceHandler = debounce((evt) => {
    const price = parseInt(evt.target.value, DECIMAL);
    if (price) {
      this._state.basePrice = price;
    }
  });
}
