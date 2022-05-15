import PointPresenter from './point-presenter';
import { render } from '../framework/render';

export default class MainPresenter {
  #model = null;
  #pointsListView;
  #controlsContainer;
  #eventsContainer;
  #filtersFormView;
  #sortFormView;
  #noPointsMessageView;

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
    this.#model = model;
    this.#pointsListView = pointsListView;
    this.#controlsContainer = controlsContainer;
    this.#eventsContainer = eventsContainer;
    this.#filtersFormView = filtersFormView;
    this.#sortFormView = sortFormView;
    this.#noPointsMessageView = noPointsMessageView;
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
