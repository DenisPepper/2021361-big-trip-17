import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointRow extends AbstractView {
  #point;
  #offers;
  #destinations;
  _events = {
    editClick: null,
  };

  constructor(point, offers, destinations) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointRowTemplate(
      this.#point,
      this.#offers,
      this.#destinations
    );
  }

  setEditClickHandler = (callback) => {
    this._events.editClick = callback;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = () => {
    this._events.editClick();
  };
}
