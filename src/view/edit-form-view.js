import { createEditPointFormTempalte } from '../templates/edit-form.js';
import { createElement } from '../render.js';

export default class EditForm {
  getTemplate = () => createEditPointFormTempalte();

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
