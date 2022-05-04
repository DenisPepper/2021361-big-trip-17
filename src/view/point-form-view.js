import { createPointFormTempalte } from '../templates/point-form-templ';
import { createElement } from '../render.js';

export default class PointForm {
  #point;
  #offers;
  #destinations;

  constructor(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  getTemplate = () =>
    createPointFormTempalte(this.#point, this.#offers, this.#destinations);

  getElement = () => {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
