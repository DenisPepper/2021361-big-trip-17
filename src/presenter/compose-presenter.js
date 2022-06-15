import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import { Sorts } from '../settings';
import { Filters } from '../services/filter';
import { render, remove } from '../framework/render';
import { RenderPosition } from '../settings';

export default class СomposePresenter {
  #filtersFormView = null;
  #sortFormView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #currentFilterName = null;
  #currentSortName = null;
  #save = {filter: null, sort: null};
  #filtersCounter = {
    [Filters.EVERYTHING]: 0,
    [Filters.FUTURE]: 0,
    [Filters.PAST]: 0,
  };

  #callback = {
    updatePointsList: () => {},
  };

  constructor(args) {
    const {
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
    } = args;
    if (filtersFormView instanceof FiltersForm) {
      this.#filtersFormView = filtersFormView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${FiltersForm}`);
    }
    if (sortFormView instanceof SortForm) {
      this.#sortFormView = sortFormView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${SortForm}`);
    }
    this.#controlsContainer = controlsContainer;
    this.#eventsContainer = eventsContainer;
    this.#currentFilterName = Filters.EVERYTHING;
    this.#currentSortName = Sorts.DAY;
    this.init();
  }

  init = (updatePointsList) => {
    this.#callback.updatePointsList = updatePointsList;
    return this;
  };

  initForms = () => {
    this.#sortFormView.init(this.#changeSortHandler);
    this.#filtersFormView.init(this.#changeFilterHandler);
    return this;
  };

  checkFiltersAbsence = () => {
    Object.entries(this.#filtersCounter).forEach(this.#callAbsenceMethod);
  };

  #callAbsenceMethod = ([filter, count]) => {
    this.#filtersFormView[this.#getAbsenceMethod(count)](filter);
  };

  #getAbsenceMethod = (count) => count === 0 ? 'disableFilter' : 'enableFilter';

  reduceFiltersCounter = (point) => {
    this.#filtersCounter[Filters.EVERYTHING] --;
    this.reduceFilters(point);
  };

  reduceFilters = (point) => {
    if (point.isFuture) {
      this.#filtersCounter[Filters.FUTURE] --;
    }
    if (point.isPast) {
      this.#filtersCounter[Filters.PAST] --;
    }
  };

  increaseFiltersCounter = (point) => {
    if (point.isNew) {
      return;
    }
    this.#filtersCounter[Filters.EVERYTHING] ++;
    this.increaseFilters(point);
  };

  increaseFilters = (point) => {
    if (point.isFuture) {
      this.#filtersCounter[Filters.FUTURE] ++;
    }
    if (point.isPast) {
      this.#filtersCounter[Filters.PAST] ++;
    }
  };

  getCount = () => this.#filtersCounter[this.#currentFilterName];

  getCurrentFilter = () => {
    if (this.#filtersCounter[Filters.EVERYTHING] === 0) {
      this.setFirstFilterChecked();
      this.#filtersFormView.disableAllFilters();
    }
    return this.#currentFilterName;
  };

  getCurrentSort = () => this.#currentSortName;

  renderFilterForm = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    this.#filtersFormView.setFiltersClickHandler();
    return this;
  };

  renderSortForm = () => {
    render(this.#sortFormView, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    this.#sortFormView.setSortsClickHandler();
    this.setFirstSortChecked();
    return this;
  };

  removeSortForm = () => {
    this.#sortFormView.removeSortsClickHandler();
    remove(this.#sortFormView);
  };

  #changeFilterHandler = (filterName) => {
    this.setFirstSortChecked();
    this.#currentFilterName = filterName;
    this.#callback.updatePointsList();
  };

  #changeSortHandler = (sortName) => {
    this.#currentSortName = sortName;
    this.#callback.updatePointsList();
  };

  setFirstFilterChecked = () => {
    this.setFilter(Filters.EVERYTHING);
  };

  setFirstSortChecked = () => {
    this.setSort(Sorts.DAY);
  };

  setFilter = (filter) => {
    this.#currentFilterName = filter;
    this.#filtersFormView.setChecked(filter);
  };

  setSort = (sort) => {
    this.#currentSortName = sort;
    this.#sortFormView.setChecked(sort);
  };

  saveCurrentState = () => {
    this.#save = {filter: this.#currentFilterName, sort: this.#currentSortName};
  };

  restoreSavedState = () => {
    const {filter, sort} = this.#save;
    this.setFilter(filter);
    this.setSort(sort);
  };
}
