import PointPresenter from './point-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import PointForm from '../view/point-form-view';
import PointRow from '../view/point-row-view';
import { render } from '../framework/render';

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #noPointsMessageView = null;

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
    /*
    if (controlsContainer instanceof ______) {
    } else {
    }
    if (eventsContainer instanceof ______) {
    } else {
    }*/
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

  init = () => {
    render(this.#filtersFormView, this.#controlsContainer);
    render(this.#sortFormView, this.#eventsContainer);
  };

  addPointToPointList = (point, pointRowView, pointFormView) => {
    const pointPresenter = new PointPresenter({
      point,
      pointRowView,
      pointFormView,
      pointsListView: this.#pointsListView,
    });
    pointPresenter.renderPoint();
  };

  renderPointsList = () => {
    if (this.#model === null) {
      return;
    }
    if (this.#model.points.length === 0) {
      render(this.#noPointsMessageView, this.#eventsContainer);
    } else {
      render(this.#pointsListView, this.#eventsContainer);
    }
  };
}
