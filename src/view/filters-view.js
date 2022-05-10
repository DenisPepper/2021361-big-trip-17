import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class FiltersForm extends AbstractView {
  get template() {
    return createFiltersFormTemplate();
  }

  getElement = () => this.element;
}
