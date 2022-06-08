import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class FiltersForm extends AbstractView {
  _callback = {
    filterClick: null,
  };

  #filterEverything = this.element.querySelector('#filter-everything');

  constructor() {
    super();
    this.#filterEverything.checked = true;
  }

  get template() {
    return createFiltersFormTemplate();
  }

  setFiltersClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('input', this.#FiltersClickHandler);
  };

  #FiltersClickHandler = (evt) => {
    this._callback.filterClick(evt.target.value);
  };
}
