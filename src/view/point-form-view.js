import { createPointFormTempalte } from '../templates/point-form-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointForm extends AbstractStatefulView {
  #point;
  #offers;
  #destinations;
  _callback = {
    closeClick: () => {},
    saveClick: () => {},
  };

  rollupButton = null;

  constructor(point, offers, destinations) {
    super();
    this.state = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.rollupButton = this.element.querySelector('.event__rollup-btn');
    this.rollupButton.addEventListener('click', this.#closeClickHandler);
    this.element.addEventListener('submit', this.#saveClickHandler);
  };

  get state() {
    const point = { ...this._state };
    return point;
  }

  set state(point) {
    this._state = { ...point };
  }

  get template() {
    return createPointFormTempalte(
      this._state,
      this.#offers,
      this.#destinations
    );
  }

  _restoreHandlers = () => {
    this.init();
  };

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
}
