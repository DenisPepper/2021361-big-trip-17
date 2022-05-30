import PointPresenter from './point-presenter';
import СomposePresenter from './compose-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import NoPointsMessage from '../view/no-point-message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import { render, remove, replace } from '../framework/render';
import { Actions } from '../settings';

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
    return this.#model.points;
  }

  get offers() {
    return this.#model.offers;
  }

  get destinations() {
    return this.#model.destinations;
  }

  #setNotifications = () => {
    this.#model.addEvent(Actions.RENDER_POINTS_LIST, (args) =>
      this.#renderPointsList(args)
    );
  };

  init = () => {
    this.#composePresenter = new СomposePresenter(
      {
        model: this.#model,
        filtersFormView: this.#filtersFormView,
        sortFormView: this.#sortFormView,
        controlsContainer: this.#controlsContainer,
        eventsContainer: this.#eventsContainer
      })
      .renderFilterForm()
      .renderSortForm();
    this.#setNotifications();
    this.#model.composePointsList(Actions.RENDER_POINTS_LIST);
  };

  #closeCurrentEditView = (pointPresenter) => {
    if (this.#currentPointPresenter === null) {
      this.#currentPointPresenter = pointPresenter;
    } else {
      this.#currentPointPresenter.removeOnEscClickHandler();
      replace(
        this.#currentPointPresenter.pointRowView,
        this.#currentPointPresenter.pointFormView
      );
      this.#currentPointPresenter = pointPresenter;
    }
  };

  #resetCurrentPointPresenter = () => {
    this.#currentPointPresenter = null;
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
