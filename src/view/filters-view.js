import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class FiltersForm extends AbstractView {
  _callback = {
    setFiltersClick: null,
  };

  get template() {
    return createFiltersFormTemplate();
  }

  setFiltersClickHandler = (callback) => {
    this._callback.setFiltersClick = callback;
    this.element.addEventListener('change', this.#FiltersClickHandler);
  };

  #FiltersClickHandler = (evt) => {
    this._callback.setFiltersClick(evt.target.value);
  };
}
