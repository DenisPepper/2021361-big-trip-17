import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import { Sorts } from '../settings';
import { Filters } from '../services/filter';
import { render, remove } from '../framework/render';

export default class СomposePresenter {
  #filtersFormView = null;
  #sortFormView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #currentFilterName = null;
  #currentSortName = null;
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
  }

  init = (updatePointsList) => {
    this.#callback.updatePointsList = updatePointsList;
    return this;
  };

  checkFiltersAbsence = () => {
    for (const key in this.#filtersCounter) {
      if (this.#filtersCounter[key] === 0) {
        this.#filtersFormView.disableFilter(key);
      } else {
        this.#filtersFormView.enableFilter(key);
      }
    }
  };

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

  getFilterName = () => {
    if (this.#filtersCounter[Filters.EVERYTHING] === 0) {
      this.#currentFilterName = Filters.EVERYTHING;
      this.#filtersFormView.init();
    }
    return this.#currentFilterName;
  };

  getSortName = () => this.#currentSortName;

  renderFilterForm = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    this.#filtersFormView.setFiltersClickHandler(this.#changeFilterHandler);
    return this;
  };

  renderSortForm = () => {
    if (this.#filtersCounter[Filters.EVERYTHING] === 0) {
      return;
    }
    render(this.#sortFormView, this.#eventsContainer);
    this.#sortFormView.setSortsClickHandler(this.#changeSortHandler);
    return this;
  };

  removeSortForm = () => {
    this.#sortFormView.removeSortsClickHandler();
    remove(this.#sortFormView);
  };

  #changeFilterHandler = (filterName) => {
    this.#sortFormView.init();
    this.#sortFormView.setSortsClickHandler(this.#changeSortHandler);
    this.#currentFilterName = filterName;
    this.#currentSortName = Sorts.DAY;
    this.#callback.updatePointsList();
    if (this.getCount === 0) {
      this.removeSortForm();
    }
  };

  #changeSortHandler = (sortName) => {
    this.#currentSortName = sortName;
    this.#callback.updatePointsList();
  };
}
