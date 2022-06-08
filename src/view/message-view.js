import AbstractView from '../framework/view/abstract-view';
import { createMessageTemplate } from '../templates/message-templ';
import { Messages } from '../settings';

export default class Message extends AbstractView {
  get template() {
    const template = createMessageTemplate();
    return template;
  }

  get message() {
    return this.element.textContent;
  }

  set message(filter) {
    this.element.textContent = Messages[filter] || filter;
  }
}
