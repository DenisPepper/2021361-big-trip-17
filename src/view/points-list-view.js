import { createPointListTemplate } from '../templates/point-list-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointsList extends AbstractView {
  get template() {
    return createPointListTemplate();
  }

  closePointForm = (pointFormView, pointRowView) => {
    this.element.replaceChild(pointRowView.element, pointFormView.element);
  };

  openPointForm = (pointFormView, pointRowView) => {
    this.element.replaceChild(pointFormView.element, pointRowView.element);
  };
}
