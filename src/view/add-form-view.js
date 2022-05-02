import { createAddPointFormTemplate } from '../templates/add-form.js';
import { createElement } from '../render.js';

export default class AddPointForm {
  getTemplate = () => createAddPointFormTemplate();

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
