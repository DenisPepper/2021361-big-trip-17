import { createPointFormTempalte } from '../templates/point-form-templ';
import { debounce } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/material_blue.css';

const DELAY = 1000;

const flatpickrStartTimeSettings = {
  enableTime: true,
  altInput: true,
  altFormat: 'd/m/y H:i',
  dateFormat: 'Z',
  'locale': Russian,
  defaultHour: 8,
};

const flatpickrEndTimeSettings = {...flatpickrStartTimeSettings};

export default class PointForm extends AbstractStatefulView {
  _state;
  #offers = null;
  #destinations = null;
  _callback = {
    closeClick: () => {},
    saveClick: () => {},
  };

  #rollupButton = null;
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
  };

  #findElements = () => {
    this.#eventStartTime = this.element.querySelector('#event-start-time-1');
    this.#eventEndTime = this.element.querySelector('#event-end-time-1');
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#eventTypeGroup = this.element.querySelector('.event__type-list');
    this.#eventDestination = this.element.querySelector('.event__field-group--destination');
  };

  #setHandlers = () => {
    this.element.addEventListener('submit', this.#saveClickHandler);
    this.#eventTypeGroup.addEventListener('input', this.#whenInputPointType);
    this.#eventDestination.addEventListener('input', this.#whenInputDestination);
    this.#rollupButton.addEventListener('click', this.#closeClickHandler);
    this.#eventStartTime.addEventListener('input', this.#whenInputStartTime);
    this.#eventEndTime.addEventListener('input', this.#whenInputEndtTime);
  };

  #setFlatpickr = () => {
    flatpickr(this.#eventStartTime, flatpickrStartTimeSettings);
    this.#flatpickrEndTime = flatpickr(this.#eventEndTime, {...flatpickrEndTimeSettings, minDate: this._state.dateFrom});
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

  #closeClickHandler = () => {
    this._callback.closeClick();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveClick();
  };

  #whenInputPointType = (evt) => {
    this.updateElement({ type: evt.target.value, offers: []});
  };

  #whenInputDestination = debounce((evt) => {
    const destIndex = this.#destinations.findIndex(
      (element) => element.name === evt.target.value
    );
    if (destIndex !== -1 && destIndex !== this._state.destination) {
      this.updateElement({ destination: destIndex });
    }
  });

  #whenInputStartTime = debounce((evt) => {
    this._state.dateFrom = evt.target.value;
    this.#flatpickrEndTime.set('minDate', this._state.dateFrom);
  }, DELAY);

  #whenInputEndtTime = debounce((evt) => {
    this._state.dateTo = evt.target.value;
  }, DELAY);
}
