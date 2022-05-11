import { createPointFormTempalte } from '../templates/point-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointForm extends AbstractView {
  #point;
  #offers;
  #destinations;
  _events = {
    closeClick: null,
    saveClick: null,
  };

  constructor(point, offers, destinations) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointFormTempalte(
      this.#point,
      this.#offers,
      this.#destinations
    );
  }

  setCloseClickHandler = (callback) => {
    this._events.closeClick = callback;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
  };

  setSaveClickHandler = (callback) => {
    this._events.saveClick = callback;
    this.element.addEventListener('submit', this.#saveClickHandler);
  };

  #closeClickHandler = () => {
    this._events.closeClick();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this._events.saveClick();
  };
}
