import AbstractView from '../framework/view/abstract-view';
import { createMessageTemplate } from '../templates/message-templ';
import { Messages } from '../settings';

export default class MessageView extends AbstractView {
  get template() {
    return createMessageTemplate();
  }

  get message() {
    return this.element.textContent;
  }

  set message(filter) {
    this.element.textContent = Messages[filter] || filter;
  }
}
