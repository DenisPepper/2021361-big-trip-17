import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class FiltersForm extends AbstractView {
  _callback = {
    setFiltersClick: null,
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
    this._callback.setFiltersClick = callback;
    this.element.addEventListener('input', this.#FiltersClickHandler);
  };

  #FiltersClickHandler = (evt) => {
    this._callback.setFiltersClick(evt.target.value);
  };
}
