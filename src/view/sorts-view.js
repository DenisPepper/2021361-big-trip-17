import { createSortFormTemplate } from './templates.js';
import { createElement } from '../render.js';

export default class SortForm {
  getTemplate = () => createSortFormTemplate();

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
