import PointPresenter from './point-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import { render, remove, replace } from '../framework/render';
import { Filters } from '../settings';
import { FilterSettings } from '../settings';
import { Sorts } from '../settings';
import { SortSettings } from '../settings';
import dayjs from 'dayjs';

const getFilterSettings = (filter) => {
  const nullPredicate = () => true;
  const currentDate = dayjs();
  const filterRule = FilterSettings[filter];
  return filterRule === undefined ? nullPredicate : filterRule(currentDate);
};

const getSortSettings = (sort) => {
  const defaultCompare = () => 0;
  return SortSettings[sort] || defaultCompare;
};

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #noPointsMessageView = null;
  #currentpointPresenter = null;
  #currentFilter = null;
  #currentSort = null;

  constructor(args) {
    const {
      model,
      pointsListView,
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
      noPointsMessageView,
    } = args;

    if (model instanceof Model) {
      this.#model = model;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Model}`);
    }

    if (pointsListView instanceof PointsList) {
      this.#pointsListView = pointsListView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${PointsList}`);
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

    if (noPointsMessageView instanceof NoPointsMessage) {
      this.#noPointsMessageView = noPointsMessageView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${NoPointsMessage}`);
    }

    this.#controlsContainer = controlsContainer;
    this.#eventsContainer = eventsContainer;
  }

  get points() {
    return this.#model === null ? [] : this.#model.points;
  }

  get offers() {
    return this.#model === null ? [] : this.#model.offers;
  }

  get destinations() {
    return this.#model === null ? [] : this.#model.destinations;
  }

  #whenChangeFilters = (value) => {
    this.#currentFilter = value;
    this.#currentSort = Sorts.DAY;
    this.#sortFormView.init(this.#whenChangeSorts);
    this.#renderPointsList();
  };

  #whenChangeSorts = (value) => {
    this.#currentSort = value;
    this.#renderPointsList();
  };

  init = () => {
    this.#currentFilter = Filters.EVERYTHING;
    this.#currentSort = Sorts.DAY;
    this.#filtersFormView.setFiltersClickHandler(this.#whenChangeFilters);
    this.#sortFormView.init(this.#whenChangeSorts);
    render(this.#filtersFormView, this.#controlsContainer);
    render(this.#sortFormView, this.#eventsContainer);
    this.#renderPointsList();
  };

  #closeCurrentEditView = (pointPresenter) => {
    if (this.#currentpointPresenter === null) {
      this.#currentpointPresenter = pointPresenter;
    } else {
      this.#currentpointPresenter.removeOnEscClickHandler();
      replace(
        this.#currentpointPresenter.pointRowView,
        this.#currentpointPresenter.pointFormView
      );
      this.#currentpointPresenter = pointPresenter;
    }
  };

  #resetCurrentPointPresenter = () => {
    this.#currentpointPresenter = null;
  };

  #showNoPointsMessage = () => {
    remove(this.#sortFormView);
    this.#noPointsMessageView.message = this.#currentFilter;
    render(this.#noPointsMessageView, this.#eventsContainer);
  };

  #renderPointsList = () => {
    const points = this.points.filter(getFilterSettings(this.#currentFilter));

    remove(this.#pointsListView);

    if (points.length === 0) {
      this.#showNoPointsMessage();
      return;
    }

    points.sort(getSortSettings(this.#currentSort)).forEach(this.#renderPoint);

    if (this.#eventsContainer.contains(this.#noPointsMessageView.element)) {
      remove(this.#noPointsMessageView);
    }

    if (!this.#eventsContainer.contains(this.#sortFormView.element)) {
      this.#sortFormView.init(this.#whenChangeSorts);
    }

    render(this.#sortFormView, this.#eventsContainer);
    render(this.#pointsListView, this.#eventsContainer);
  };

  #renderPoint = (point) => {
    this.#addPointToPointsList(
      point,
      new PointRow(point, this.offers, this.destinations),
      new PointForm(point, this.offers, this.destinations)
    );
  };

  #addPointToPointsList = (point, pointRowView, pointFormView) => {
    const pointPresenter = new PointPresenter({
      point,
      pointRowView,
      pointFormView,
      pointsListView: this.#pointsListView,
    });
    pointPresenter.init(
      this.#closeCurrentEditView,
      this.#resetCurrentPointPresenter
    );
    pointPresenter.renderPoint();
  };
}
