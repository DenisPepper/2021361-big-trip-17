import PointPresenter from './point-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import { render, remove, replace } from '../framework/render';
import { Filters } from '../const';
import Filter from '../filter';

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #noPointsMessageView = null;
  #currentpointPresenter = null;
  //#pointPresenters = new Map();
  #currentFilter = Filters.EVERYTHING;

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
    this.#applayCurrentFilter();
  };

  init = () => {
    this.#filtersFormView.setFiltersClickHandler(this.whenChangeFilters);
    render(this.#filtersFormView, this.#controlsContainer);
    render(this.#sortFormView, this.#eventsContainer);
    this.#applayCurrentFilter();
  };

  #applayCurrentFilter = () => {
    const points = Filter.run(this.#currentFilter, this.points);
    this.#addPointsToPointList(points);
  };

  closeCurrentEditView = (pointPresenter) => {
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

  #addPointsToPointList = (points) => {
    remove(this.#pointsListView);
    if (points.length === 0) {
      remove(this.#sortFormView);
      this.#noPointsMessageView.message = this.#currentFilter;
      render(this.#noPointsMessageView, this.#eventsContainer);
      return;
    }
    points.forEach((point) =>
      this.#addPointToPointsList(
        point,
        new PointRow(point, this.offers, this.destinations),
        new PointForm(point, this.offers, this.destinations)
      )
    );
    remove(this.#noPointsMessageView);
    render(this.#sortFormView, this.#eventsContainer);
    render(this.#pointsListView, this.#eventsContainer);
  };

  #addPointToPointsList = (point, pointRowView, pointFormView) => {
    const pointPresenter = new PointPresenter({
      point,
      pointRowView,
      pointFormView,
      pointsListView: this.#pointsListView,
    });
    pointPresenter.init(
      this.updatePointRowView,
      this.closeCurrentEditView,
      this.resetCurrentPointPresenter
    );
    pointPresenter.renderPoint();
  };
}
