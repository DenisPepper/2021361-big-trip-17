import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import Model from '../model/model';
import { Actions, Sorts } from '../settings';
import { render } from '../framework/render';

export default class СomposePresenter {
  #model = null;
  #filtersFormView = null;
  #sortFormView = null;
  #controlsContainer = null;
  #eventsContainer = null;

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
  }

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

  #whenChangeFilters = (filterName) => {
    this.#sortFormView.init();
    this.#sortFormView.setSortsClickHandler(this.#whenChangeSorts);
    this.#model.setFilterName(filterName);
    this.#model.setSortName(Sorts.DAY);
    this.#model.composePointsList(Actions.RENDER_POINTS_LIST);
  };

  #whenChangeSorts = (sortName) => {
    this.#model.setSortName(sortName);
    this.#model.composePointsList(Actions.RENDER_POINTS_LIST);
  };
}
