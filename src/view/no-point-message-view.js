import AbstractView from '../framework/view/abstract-view';
import { createNoPointMessageTemplate } from '../templates/no-point-message-templ';
import { NoPointsMessages } from '../settings';

export default class NoPointsMessage extends AbstractView {
  get template() {
    return createNoPointMessageTemplate();
  }

  get message() {
    return this.element.textContent;
  }

  set message(filter) {
    this.element.textContent =
      NoPointsMessages[filter] || 'Click New Event to create your first point';
  }
}
