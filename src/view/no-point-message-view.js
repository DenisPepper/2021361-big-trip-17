import AbstractView from '../framework/view/abstract-view';
import { createNoPointMessageTemplate } from '../templates/no-point-message-templ';
import { Filters } from '../settings';

export default class NoPointsMessage extends AbstractView {
  #message = null;

  get template() {
    return createNoPointMessageTemplate();
  }

  get message() {
    return this.element.textContent;
  }

  set message(filter) {
    let message = '';
    switch (filter) {
      case Filters.EVERYTHING:
        message = 'Click New Event to create your first point';
        break;
      case Filters.FUTURE:
        message = 'There are no future events now';
        break;
      case Filters.PAST:
        message = 'There are no past events now';
        break;
    }
    this.element.textContent = message;
  }
}
