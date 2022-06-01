import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointRow extends AbstractStatefulView {
  _state;
  #offers = null;
  #destinations = null;
  _callback = {
    rollupButtonClick: () => {},
    favoriteButtonClick: () => {},
  };

  rollupButton = null;
  favoriteButton = null;

  constructor(point, offers, destinations) {
    super();
    this.#setState(point);
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.#findElements();
    this.#setHandlers();
  };

  #findElements = () => {
    this.rollupButton = this.element.querySelector('.event__rollup-btn');
    this.favoriteButton = this.element.querySelector('.event__favorite-btn');
  };

  #setHandlers = () => {
    this.rollupButton.addEventListener('click', this.#editClickHandler);
    this.favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  _restoreHandlers = () => {
    this.init();
  };

  #setState = (point) => {
    this._state = { ...point };
  };

  #getState = () => ({ ...this._state });

  get template() {
    return createPointRowTemplate(
      this._state,
      this.#offers,
      this.#destinations
    );
  }

  setFavoriteClickCallback = (callback) => {
    this._callback.favoriteButtonClick = callback;
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
    this._callback.favoriteButtonClick(this.#getState());
  };
}
