import AbstractView from '../framework/view/abstract-view';
import { createNoPointMessageTemplate } from '../templates/no-point-message-templ';

export default class NoPointsMessage extends AbstractView {
  get template() {
    return createNoPointMessageTemplate();
  }
}
