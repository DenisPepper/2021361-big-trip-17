import { createElement } from '../render.js';

export default class NoPointsMessage {
  #element;

  get template() {
    return '<p class="trip-events__msg">* Everthing – Click New Event to create your first point; * Past — There are no past events now; * Future — There are no future events now</p>';
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
