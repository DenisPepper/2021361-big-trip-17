import { createElement } from '../render.js';

export default class PointsList {
  #element;

  get template() {
    return '<ul class="trip-events__list"></ul>';
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
