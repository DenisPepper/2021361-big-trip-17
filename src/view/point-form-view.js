import { createPointFormTempalte } from '../templates/point-form-templ';
import { debounce } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/material_blue.css';
import { DECIMAL } from '../settings';

const SubmitButtonText = {SAVE: 'Save', SAVING: 'Saving...'};
const ResetButtonText = {DELETE: 'Delete', DELETING: 'Deleting...'};
const Actions = {SUBMIT: 'submit', RESET: 'reset'};
const SPLICE_COUNT = 1;
const Delay = {
  POINT_TYPE: 200,
  PRICE: 200,
  DEST: 500,
  OFFER: 250,
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
  #offers = null;
  #destinations = null;
  #elements = new Map();
  #action = null;
  #flatpickrEndTime = null;
  _state;
  _callback = {
    closeClick: () => {},
    saveClick: () => {},
    resetClick: () => {},
  };

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
    this.#elements.get('resetButton').disabled = this._state.isNew;
    this.#elements.get('destination').placeholder = 'choose destination';
    this.#elements.get('submitButton').textContent = SubmitButtonText.SAVE;
    this.#elements.get('resetButton').textContent = ResetButtonText.DELETE;
  };

  #findElements = () => {
    this.#elements.set('submitButton', this.element.querySelector('.event__save-btn'));
    this.#elements.set('resetButton', this.element.querySelector('.event__reset-btn'));
    this.#elements.set('startTime', this.element.querySelector('#event-start-time-1'));
    this.#elements.set('endTime', this.element.querySelector('#event-end-time-1'));
    this.#elements.set('rollupButton', this.element.querySelector('.event__rollup-btn'));
    this.#elements.set('eventTypeGroup', this.element.querySelector('.event__type-list'));
    this.#elements.set('destination', this.element.querySelector('.event__input--destination'));
    this.#elements.set('price', this.element.querySelector('#event-price-1'));
    this.#elements.set('offers', this.element.querySelector('.event__details'));
  };

  #setHandlers = () => {
    this.element.addEventListener('submit', this.#saveClickHandler);
    this.element.addEventListener('reset', this.#resetClickHandler);
    this.#elements.get('eventTypeGroup').addEventListener('input', this.#inputPointTypeHandler);
    this.#elements.get('destination').addEventListener('input', this.#inputDestinationHandler);
    this.#elements.get('rollupButton').addEventListener('click', this.#closeClickHandler);
    this.#elements.get('startTime').addEventListener('input', this.#inputStartTimeHandler);
    this.#elements.get('endTime').addEventListener('input', this.#inputEndtTimeHandler);
    this.#elements.get('price').addEventListener('input', this.#inputPriceHandler);
    this.#elements.get('offers').addEventListener('input', this.#inputOffersHandler);
  };

  #setFlatpickr = () => {
    flatpickr(this.#elements.get('startTime'), flatpickrSettings);
    this.#flatpickrEndTime = flatpickr(this.#elements.get('endTime'), {...flatpickrSettings, minDate: this._state.dateFrom});
  };

  _restoreHandlers = () => {
    this.init();
  };

  #removeHandlers = () => {
    this.element.removeEventListener('submit', this.#saveClickHandler);
    this.element.removeEventListener('reset', this.#resetClickHandler);
    this.#elements.get('eventTypeGroup').removeEventListener('input', this.#inputPointTypeHandler);
    this.#elements.get('destination').removeEventListener('input', this.#inputDestinationHandler);
    this.#elements.get('rollupButton').removeEventListener('click', this.#closeClickHandler);
    this.#elements.get('startTime').removeEventListener('input', this.#inputStartTimeHandler);
    this.#elements.get('endTime').removeEventListener('input', this.#inputEndtTimeHandler);
    this.#elements.get('price').removeEventListener('input', this.#inputPriceHandler);
    this.#elements.get('offers').removeEventListener('input', this.#inputOffersHandler);
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

  removeEventListeners = () => {
    this.#removeHandlers();
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
    this.#disableFormElements();
    this.#switchSubmitButtonText();
    this.#action = Actions.SUBMIT;
    this._callback.saveClick(this._state);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#disableFormElements();
    this.#switchResetButtonText();
    this.#action = Actions.RESET;
    this._callback.resetClick(this.state);
  };

  loadErrorHandler = () => {
    this.shake(() => {
      this.#enableFormElements();
      if (this.#action === Actions.RESET) {
        this.#switchResetButtonText();
      } else {
        this.#switchSubmitButtonText();
      }
    });
  };

  #inputPointTypeHandler = debounce((evt) => {
    this.updateElement({ type: evt.target.value, offers: []});
  }, Delay.POINT_TYPE);

  #inputDestinationHandler = debounce((evt) => {
    const destination = this.#destinations.find(
      (element) => element.name === evt.target.value
    );
    if (destination) {
      this.updateElement({ destination, offers:[] });
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
  }, Delay.PRICE);

  #inputOffersHandler = debounce((evt) => {
    const target = evt.target;
    const offers = this._state.offers;
    const id = parseInt(target.id.split('-').pop(), DECIMAL);
    if (target.checked) {
      offers.push(id);
    } else {
      offers.splice(offers.findIndex((element) => element === id), SPLICE_COUNT);
    }
  }, Delay.OFFER);

  #disableFormElements = () => {
    const elements = [...this.element.elements];
    elements.forEach((element) => {
      element.disabled = true;
    });
  };

  #enableFormElements = () => {
    const elements = [...this.element.elements];
    elements.forEach((element) => {
      element.disabled = false;
    });
    this.#elements.get('resetButton').disabled = this._state.isNew;
  };

  #switchResetButtonText = () => {
    if (this.#elements.get('resetButton').textContent === ResetButtonText.DELETING) {
      this.#elements.get('resetButton').textContent = ResetButtonText.DELETE;
    } else {
      this.#elements.get('resetButton').textContent = ResetButtonText.DELETING;
    }
  };

  #switchSubmitButtonText = () => {
    if(this.#elements.get('submitButton').textContent === SubmitButtonText.SAVING) {
      this.#elements.get('submitButton').textContent = SubmitButtonText.SAVE;
    } else {
      this.#elements.get('submitButton').textContent = SubmitButtonText.SAVING;
    }
  };
}
