import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import { createElement } from '../render.js';

export default class SortForm {
  #element;

  get template() {
    return createSortsFormTemplate();
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
