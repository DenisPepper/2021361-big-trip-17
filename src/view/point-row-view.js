import { createPointRowTemplate } from '../templates/point-row-templ';
import { createElement } from '../render.js';

export default class PointRow {
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
    return createPointRowTemplate(
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
