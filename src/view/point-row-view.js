import { createPointRowTemplate } from '../templates/point-row-templ';
import { createElement } from '../render.js';

export default class PointRow {
  #point;
  #offers;
  #destinations;

  constructor(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  getTemplate = () =>
    createPointRowTemplate(this.#point, this.#offers, this.#destinations);

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
