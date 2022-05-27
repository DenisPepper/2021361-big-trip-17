import { createPointFormTempalte } from '../templates/point-form-templ';
import { debounce } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointForm extends AbstractStatefulView {
  _state;
  #offers = null;
  #destinations = null;
  _callback = {
    closeClick: () => {},
    saveClick: () => {},
  };

  rollupButton = null;
  eventTypeGroup = null;
  eventDestination = null;

  constructor(point, offers, destinations) {
    super();
    this.state = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.#setHandlers();
  };

  #setHandlers = () => {
    this.rollupButton = this.element.querySelector('.event__rollup-btn');
    this.eventTypeGroup = this.element.querySelector('.event__type-list');
    this.eventDestination = this.element.querySelector('.event__field-group--destination');
    this.element.addEventListener('submit', this.#saveClickHandler);
    this.eventTypeGroup.addEventListener('input', this.#whenChangePointType);
    this.eventDestination.addEventListener('input', this.#whenChangeDestination);
    this.rollupButton.addEventListener('click', this.#closeClickHandler);
  };

  _restoreHandlers = () => {
    this.#setHandlers();
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

  #whenChangePointType = (evt) => {
    this.updateElement({ type: evt.target.value, offers: []});
  };

  #whenChangeDestination = debounce((evt) => {
    const destIndex = this.#destinations.findIndex(
      (element) => element.name === evt.target.value
    );
    if (destIndex !== -1 && destIndex !== this._state.destination) {
      this.updateElement({ destination: destIndex });
    }
  });
}
