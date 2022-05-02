import { createSortsFormTemplate } from '../templates/sorts-form.js';
import { createElement } from '../render.js';

export default class SortForm {
  getTemplate = () => createSortsFormTemplate();

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
