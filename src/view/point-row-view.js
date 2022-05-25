import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractStatefulView from '../framework/view/abstract-view';

export default class PointRow extends AbstractStatefulView {
  #point;
  #offers;
  #destinations;
  _callback = {
    rollupButtonClick: null,
    favoriteButtonClick: null,
  };

  rollupButton = null;
  favoriteButton = null;

  constructor(point, offers, destinations) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init();
  }

  init = () => {
    this.rollupButton = this.element.querySelector('.event__rollup-btn');
    this.favoriteButton = this.element.querySelector('.event__favorite-btn');
  };

  get template() {
    return createPointRowTemplate(
      this.#point,
      this.#offers,
      this.#destinations
    );
  }

  setEditClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.rollupButton.addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = () => {
    this._callback.rollupButtonClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteButtonClick();
  };
}
