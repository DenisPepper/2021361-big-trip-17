import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import { createElement } from '../render.js';

export default class FiltersForm {
  getTemplate = () => createFiltersFormTemplate();

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
