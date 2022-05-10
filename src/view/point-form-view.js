import { createPointFormTempalte } from '../templates/point-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class PointForm extends AbstractView {
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
    return createPointFormTempalte(
      this.#point,
      this.#offers,
      this.#destinations
    );
  }

  getElement = () => this.element;
}
