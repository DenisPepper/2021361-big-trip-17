import { createPointListTemplate } from '../templates/point-list-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointsList extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
