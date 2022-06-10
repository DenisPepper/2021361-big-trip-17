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
  #callback = {
    updateEvents: () => {},
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

  init = (updateEvents) => {
    this.#callback.updateEvents = updateEvents;
    return this;
  };

  getFilterName = () => this.#currentFilterName;

  getSortName = () => this.#currentSortName;

  renderFilterForm = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    this.#filtersFormView.setFiltersClickHandler(this.#changeFilterHandler);
    return this;
  };

  renderSortForm = () => {
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
    this.#callback.updateEvents();
  };

  #changeSortHandler = (sortName) => {
    this.#currentSortName = sortName;
    this.#callback.updateEvents();
  };
}
