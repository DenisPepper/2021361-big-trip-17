import { createTripPointTemplate } from './templates.js';
import { createElement } from '../render.js';

export default class TripPoint {
  getTemplate = () => createTripPointTemplate();

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
