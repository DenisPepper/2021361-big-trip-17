import { createPointRowTemplate } from '../templates/point-row-templ';
import { createElement } from '../render.js';

export default class PointRow {
  getTemplate = () => createPointRowTemplate();

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
