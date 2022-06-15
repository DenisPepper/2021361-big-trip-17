import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';
import { Filters } from '../services/filter';

export default class FiltersForm extends AbstractView {
  #elements = new Map();
  _callback = {
    filterClick: null,
  };

  init = (callback) => {
    this._callback.filterClick = callback;
    this.#findElements();
    this.setFirstChecked();
    this.disableAllFilters();
  };

  setFirstChecked = () => {
    this.setChecked(Filters.EVERYTHING);
  };

  setChecked = (filterName) => {
    this.#elements.get(filterName).checked = true;
  };

  #findElements = () => {
    this.#elements.set(Filters.EVERYTHING, this.element.querySelector('#filter-everything'));
    this.#elements.set(Filters.FUTURE, this.element.querySelector('#filter-future'));
    this.#elements.set(Filters.PAST, this.element.querySelector('#filter-past'));
  };

  get template() {
    return createFiltersFormTemplate();
  }

  disableAllFilters = () => {
    for (const name in Filters) {
      this.disableFilter(Filters[name]);
    }
  };

  disableFilter = (filterName) => {
    this.#elements.get(filterName).disabled = true;
  };

  enableFilter = (filterName) => {
    this.#elements.get(filterName).disabled = false;
  };

  setFiltersClickHandler = () => {
    this.element.addEventListener('input', this.#FiltersClickHandler);
  };

  #FiltersClickHandler = (evt) => {
    this._callback.filterClick(evt.target.value);
  };
}
