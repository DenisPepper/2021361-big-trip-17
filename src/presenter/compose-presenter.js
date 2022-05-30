import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import Model from '../model/model';
import { Actions, Filters, Sorts } from '../settings';
import { render, remove } from '../framework/render';

export default class СomposePresenter {
  #model = null;
  #filtersFormView = null;
  #sortFormView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #currentFilterName = null;
  #currentSortName = null;

  constructor(args) {
    const {
      model,
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
    } = args;
    if (model instanceof Model) {
      this.#model = model;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Model}`);
    }
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

  getFilterName = () => this.#currentFilterName;

  renderFilterForm = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    this.#filtersFormView.setFiltersClickHandler(this.#whenChangeFilters);
    return this;
  };

  renderSortForm = () => {
    render(this.#sortFormView, this.#eventsContainer);
    this.#sortFormView.setSortsClickHandler(this.#whenChangeSorts);
    return this;
  };

  removeSortForm = () => {
    this.#sortFormView.removeSortsClickHandler();
    remove(this.#sortFormView);
  };

  #whenChangeFilters = (filterName) => {
    this.#sortFormView.init();
    this.#sortFormView.setSortsClickHandler(this.#whenChangeSorts);
    this.#currentFilterName = filterName;
    this.#currentSortName = Sorts.DAY;
    this.#model.composePointsList(Actions.RENDER_POINTS_LIST, this.#currentFilterName, this.#currentSortName);
  };

  #whenChangeSorts = (sortName) => {
    this.#currentSortName = sortName;
    this.#model.composePointsList(Actions.RENDER_POINTS_LIST, this.#currentFilterName, this.#currentSortName);
  };
}
