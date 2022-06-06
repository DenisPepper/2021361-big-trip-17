import PointPresenter from './point-presenter';
import СomposePresenter from './compose-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import { render, remove } from '../framework/render';

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #noPointsMessageView = null;
  #currentPointPresenter = null;
  #composePresenter = null;
  #newEventButton = null;

  constructor(args) {
    const {
      model,
      pointsListView,
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
      noPointsMessageView,
      newEventButton,
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
    this.#newEventButton = newEventButton;
  }

  get points() {
    return this.#model.points;
  }

  get offers() {
    return this.#model.offers;
  }

  get destinations() {
    return this.#model.destinations;
  }

  init = () => {
    this.#newEventButton.addEventListener('click', this.#createNewEvent);
    this.#createComposePresenter();
    this.#setNotifications();
    this.#whenUpdatePoints();
  };

  #whenUpdatePoints = () => {
    const points = this.#model.compose(
      this.#composePresenter.getFilterName(),
      this.#composePresenter.getSortName()
    );
    this.#renderPointsList(points);
  };

  #setNotifications = () => {
    this.#model.addDeletePointListener((args) => this.#whenDeletePoint(args));
    this.#model.addUpdatePointsListener((args) => this.#whenUpdatePoints(args));
  };

  #createComposePresenter = () => {
    this.#composePresenter = new СomposePresenter({
      model: this.#model,
      filtersFormView: this.#filtersFormView,
      sortFormView: this.#sortFormView,
      controlsContainer: this.#controlsContainer,
      eventsContainer: this.#eventsContainer,
    })
      .init(this.#whenUpdatePoints)
      .renderFilterForm()
      .renderSortForm();
  };

  #setCurrentPointPresenter = (pointPresenter) => {
    if (this.#currentPointPresenter) {
      this.#currentPointPresenter.removeOnEscClickHandler();
      this.#currentPointPresenter.closePointForm();
    }
    this.#currentPointPresenter = pointPresenter;
  };

  #resetCurrentPointPresenter = () => {
    this.#currentPointPresenter = null;
  };

  #whenDeletePoint = (args) => {
    let { pointPresenter } = args;
    pointPresenter.clear();
    pointPresenter = null;
    this.#resetCurrentPointPresenter();
    if (this.#model.pointsLength === 0) {
      this.#showNoPointsMessage();
    }
  };

  #showNoPointsMessage = () => {
    this.#composePresenter.removeSortForm();
    this.#noPointsMessageView.message = this.#composePresenter.getFilterName();
    render(this.#noPointsMessageView, this.#eventsContainer);
  };

  #renderPointsList = (points) => {
    remove(this.#pointsListView);
    if (points.length === 0) {
      this.#showNoPointsMessage();
      return;
    }
    if (this.#eventsContainer.contains(this.#noPointsMessageView.element)) {
      remove(this.#noPointsMessageView);
      this.#composePresenter.renderSortForm();
    }
    points.forEach(this.#renderPoint);
    render(this.#pointsListView, this.#eventsContainer);
  };

  #renderPoint = (point) =>
    this.#createPointPresenter(
      this.#model,
      point,
      new PointRow(point, this.offers, this.destinations),
      new PointForm(point, this.offers, this.destinations)
    );

  #createPointPresenter = (model, point, pointRowView, pointFormView) => {
    const pointPresenter = new PointPresenter({
      model,
      point,
      pointRowView,
      pointFormView,
      pointsListView: this.#pointsListView,
    })
      .init(
        this.#setCurrentPointPresenter,
        this.#resetCurrentPointPresenter,
        this.#whenDeletePoint
      )
      .renderPoint();
    return pointPresenter;
  };

  #createNewEvent = () => {
    const pointPresenter = this.#renderPoint(this.#model.newPoint);
    pointPresenter.setOnEscClickHandler();
    this.#setCurrentPointPresenter(pointPresenter);
    if (this.#model.pointsLength === 0) {
      remove(this.#noPointsMessageView);
      render(this.#pointsListView, this.#eventsContainer);
    }
  };
}
