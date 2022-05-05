import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import { createElement } from '../render.js';

export default class FiltersForm {
  #element;

  get template() {
    return createFiltersFormTemplate();
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
