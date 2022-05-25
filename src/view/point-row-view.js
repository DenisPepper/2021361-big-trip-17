import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointRow extends AbstractStatefulView {
  #offers;
  #destinations;
  _callback = {
    rollupButtonClick: () => {},
  };

  rollupButton = null;
  favoriteButton = null;

  constructor(point, offers, destinations) {
    super();
    this.state = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.rollupButton = this.element.querySelector('.event__rollup-btn');
    this.favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.rollupButton.addEventListener('click', this.#editClickHandler);
    this.favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  get state() {
    const point = { ...this._state };
    return point;
  }

  set state(point) {
    this._state = { ...point };
  }

  get template() {
    return createPointRowTemplate(
      this._state,
      this.#offers,
      this.#destinations
    );
  }

  _restoreHandlers = () => {
    this.init();
  };

  setEditClickCallback = (callback) => {
    this._callback.rollupButtonClick = callback;
  };

  #editClickHandler = () => {
    this._callback.rollupButtonClick();
  };

  #favoriteClickHandler = () => {
    this.updateElement({
      isFavorite: !this._state.isFavorite,
    });
  };
}
