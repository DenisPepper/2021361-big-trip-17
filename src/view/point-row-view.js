import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { debounce } from '../util';

const DELAY = 500;

export default class PointRow extends AbstractStatefulView {
  _state;
  #offers = null;
  #destinations = null;
  _callback = {
    rollupButtonClick: () => {},
    favoriteButtonClick: () => {},
  };

  #rollupButton = null;
  #favoriteButton = null;
  #disabled = false;

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
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
  };

  #setHandlers = () => {
    this.#rollupButton.addEventListener('click', this.#editClickHandler);
    this.#favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  #removeHandlers = () => {
    this.#rollupButton.removeEventListener('click', this.#editClickHandler);
    this.#favoriteButton.removeEventListener('click', this.#favoriteClickHandler);
  };

  removeEventListeners = () => {
    this.#removeHandlers();
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

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
  };

  setEditClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
  };

  #editClickHandler = () => {
    this._callback.rollupButtonClick();
  };

  #favoriteClickHandler = debounce(() => {
    if (this.#disabled) {
      return;
    }
    this.#disabled = true;
    this._state.isFavorite = !this._state.isFavorite;
    this._callback.favoriteButtonClick(this.#getState());
  }, DELAY);

  favoriteUpdateHandler = (point) => {
    this.updateElement(point);
    this._restoreHandlers();
    this.#disabled = false;
  };

  favoriteErrorHandler = (point) => {
    this.shake(() => this.favoriteUpdateHandler(point));
  };
}
