import PointPresenter from './point-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import { render, remove, replace } from '../framework/render';
import PointRow from '../view/point-row-view';

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #noPointsMessageView = null;
  #currentpointPresenter = null;
  #pointPresenters = new Map();
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
    if (this.#model === null) {
      return [];
    }
    return this.#model.points;
  }

  get offers() {
    if (this.#model === null) {
      return [];
    }
    return this.#model.offers;
  }

  get destinations() {
    if (this.#model === null) {
      return [];
    }
    return this.#model.destinations;
  }

  whenChangeFilters = (value) => {
    this.#currentFilter = value;
  };

  init = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    render(this.#sortFormView, this.#eventsContainer);
    this.#filtersFormView.setFiltersClickHandler(this.whenChangeFilters);
    this.#renderPointsList();
  };

  closeCurrentEditView = (pointPresenter) => {
    if (this.#currentpointPresenter === null) {
      this.#currentpointPresenter = pointPresenter;
    } else {
      replace(
        this.#currentpointPresenter.pointRowView,
        this.#currentpointPresenter.pointFormView
      );
      this.#currentpointPresenter = pointPresenter;
    }
  };

  resetCurrentPointPresenter = () => {
    this.#currentpointPresenter = null;
  };

  updatePointRowView = (pointPresenter) => {
    const pointRowView = new PointRow(
      pointPresenter.point,
      this.#model.offers,
      this.#model.destinations
    );
    replace(pointRowView, pointPresenter.pointRowView);
    pointPresenter.pointRowView = pointRowView;
  };

  addPointToPointsList = (point, pointRowView, pointFormView) => {
    let pointPresenter;
    if (this.#pointPresenters.has(point.id)) {
      pointPresenter = this.#pointPresenters.get(point.id);
    } else {
      pointPresenter = new PointPresenter({
        point,
        pointRowView,
        pointFormView,
        pointsListView: this.#pointsListView,
      });
      this.#pointPresenters.set(point.id, pointPresenter);
    }
    pointPresenter.init(
      this.updatePointRowView,
      this.closeCurrentEditView,
      this.resetCurrentPointPresenter
    );
    pointPresenter.renderPoint();
  };

  clearPointsList = () => {
    remove(this.#pointsListView);
  };

  #hasPoints = () => this.#model.points.length === 0;

  #selectView = () =>
    this.#hasPoints() ? this.#noPointsMessageView : this.#pointsListView;

  #renderPointsList = () => {
    if (this.#model === null) {
      return;
    }
    render(this.#selectView(), this.#eventsContainer);
  };
}
