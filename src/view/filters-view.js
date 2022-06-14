import { createFiltersFormTemplate } from '../templates/filters-form-templ';
import AbstractView from '../framework/view/abstract-view';
import { Filters } from '../services/filter';

const Action = {DISABLE: 'disable', ENABLE: 'enable'};

export default class FiltersForm extends AbstractView {
  #elements = new Map();
  _callback = {
    filterClick: null,
  };

  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.#findElements();
    this.#elements.get('filterEverithing').checked = true;
    this.disableAllFilters();
  };

  #findElements = () => {
    this.#elements.set('filterEverithing', this.element.querySelector('#filter-everything'));
    this.#elements.set('filterFuture', this.element.querySelector('#filter-future'));
    this.#elements.set('filterPast', this.element.querySelector('#filter-past'));
  };

  get template() {
    return createFiltersFormTemplate();
  }

  disableAllFilters = () => {
    this.#elements.get('filterEverithing').disabled = true;
    this.#elements.get('filterFuture').disabled = true;
    this.#elements.get('filterPast').disabled = true;
  };

  disableFilter = (filterName) => this[filterName](Action.DISABLE);

  enableFilter = (filterName) => this[filterName](Action.ENABLE);

  [Filters.EVERYTHING] = (value) => {
    const predicate = value === Action.DISABLE;
    this.#elements.get('filterEverithing').disabled = predicate;
  };

  [Filters.FUTURE] = (value) => {
    const predicate = value === Action.DISABLE;
    this.#elements.get('filterFuture').disabled = predicate;
  };

  [Filters.PAST] = (value) => {
    const predicate = value === Action.DISABLE;
    this.#elements.get('filterPast').disabled = predicate;
  };

  setFiltersClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('input', this.#FiltersClickHandler);
  };

  #FiltersClickHandler = (evt) => {
    this._callback.filterClick(evt.target.value);
  };
}
