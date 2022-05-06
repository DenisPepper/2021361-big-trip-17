import { createPointFormTempalte } from '../templates/point-form-templ';
import { createElement } from '../render.js';

export default class PointForm {
  #point;
  #offers;
  #destinations;
  #element;

  constructor(point, offers, destinations) {
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

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  getElement = () => this.element;

  removeElement = () => {
    this.#element = null;
  };
}
