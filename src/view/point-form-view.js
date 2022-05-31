import { createPointFormTempalte } from '../templates/point-form-templ';
import { debounce } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/material_blue.css';

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
  };

  #setHandlers = () => {
    this.element.addEventListener('submit', this.#saveClickHandler);
    this.element.addEventListener('reset', this.#resetClickHandler);
    this.#eventTypeGroup.addEventListener('input', this.#whenInputPointType);
    this.#eventDestination.addEventListener('input', this.#whenInputDestination);
    this.#rollupButton.addEventListener('click', this.#closeClickHandler);
    this.#eventStartTime.addEventListener('input', this.#whenInputStartTime);
    this.#eventEndTime.addEventListener('input', this.#whenInputEndtTime);
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

  setCloseClickCallback = (callback) => {
    this._callback.closeClick = callback;
  };

  setSaveClickCallback = (callback) => {
    this._callback.saveClick = callback;
  };

  setResetClickCallback = (callback) => {
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

  #whenInputPointType = debounce((evt) => {
    this.updateElement({ type: evt.target.value, offers: []});
  }, Delay.POINT_TYPE);

  #whenInputDestination = debounce((evt) => {
    const destIndex = this.#destinations.findIndex(
      (element) => element.name === evt.target.value
    );
    if (destIndex !== -1 && destIndex !== this._state.destination) {
      this.updateElement({ destination: destIndex });
    }
  }, Delay.DEST);

  #whenInputStartTime = debounce((evt) => {
    this._state.dateFrom = evt.target.value;
    this.#flatpickrEndTime.set('minDate', this._state.dateFrom);
  });

  #whenInputEndtTime = debounce((evt) => {
    this._state.dateTo = evt.target.value;
  });
}
