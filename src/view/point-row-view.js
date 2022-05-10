import { createPointRowTemplate } from '../templates/point-row-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointRow extends AbstractView {
  #point;
  #offers;
  #destinations;

  constructor(point, offers, destinations) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointRowTemplate(
      this.#point,
      this.#offers,
      this.#destinations
    );
  }

  getElement = () => this.element;
}
