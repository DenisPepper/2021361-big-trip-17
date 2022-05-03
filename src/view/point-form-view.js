import { createPointFormTempalte } from '../templates/point-form-templ';
import { createElement } from '../render.js';

export default class PointForm {
  #point;
  #offers;
  #destination;

  constructor(point, offers, destination) {
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
  }

  getTemplate = (point, offers, destination) =>
    createPointFormTempalte(point, offers, destination);

  getElement = () => {
    if (!this.element) {
      this.element = createElement(
        this.getTemplate(this.#point, this.#offers, this.#destination)
      );
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
