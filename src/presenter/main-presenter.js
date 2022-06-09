import PointPresenter from './point-presenter';
import СomposePresenter from './compose-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import Message from '../view/message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import { render, remove } from '../framework/render';
import { Messages } from '../settings';

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #MessageView = null;
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
      MessageView,
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

    if (MessageView instanceof Message) {
      this.#MessageView = MessageView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Message}`);
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
    this.#disableNewEventButton();
    this.#newEventButton.addEventListener('click', this.#createNewEvent);
    this.#setNotifications();
    this.#model.init();
  };

  #setNotifications = () => {
    this.#model.addDeletePointListener((args) =>
      this.#pointDeleteHandler(args)
    );
    this.#model.addPointsUpdatedListener((args) =>
      this.#pointsUpdateHandler(args)
    );
    this.#model.addLoadErrorListener((args) => this.#loadErrorHandler(args));
    this.#model.addBeforeLoadListener((args) => this.#beforeLoadHandler(args));
    this.#model.addAfterLoadListener((args) => this.#afterLoadHandler(args));
  };

  #beforeLoadHandler = () => {
    this.#showMessage();
  };

  #afterLoadHandler = () => {
    const { offers, destinations } = this.#model.loaderState;
    if (offers.ok && destinations.ok) {
      this.#pointsUpdateHandler();
    } else {
      this.#MessageView.message = Messages.RELOAD;
    }
  };

  #pointsUpdateHandler = () => {
    if (this.#eventsContainer.contains(this.#MessageView.element)) {
      remove(this.#MessageView);
      this.#enableNewEventButton();
      this.#createComposePresenter();
    }
    const points = this.#model.compose(
      this.#composePresenter.getFilterName(),
      this.#composePresenter.getSortName()
    );
    this.#renderPointsList(points);
  };

  #createComposePresenter = () => {
    this.#composePresenter = new СomposePresenter({
      model: this.#model,
      filtersFormView: this.#filtersFormView,
      sortFormView: this.#sortFormView,
      controlsContainer: this.#controlsContainer,
      eventsContainer: this.#eventsContainer,
    })
      .init(this.#pointsUpdateHandler)
      .renderFilterForm()
      .renderSortForm();
  };

  #setCurrentPointPresenter = (pointPresenter) => {
    this.#currentPointPresenter = pointPresenter;
  };

  #closeCurrentPointForm = () => {
    if (this.#currentPointPresenter) {
      this.#currentPointPresenter.closePointForm();
    }
  };

  #resetCurrentPointPresenter = () => {
    this.#currentPointPresenter = null;
  };

  #pointDeleteHandler = () => {
    this.#currentPointPresenter.clear();
    this.#resetCurrentPointPresenter();
    // create predicate, which controls count of points with current filter
    /*if () {
      this.#showNoPointsMessage();
    }*/
  };

  #loadErrorHandler = () => {
    this.#currentPointPresenter.onLoadErrorHandler();
  };

  #showMessage = () => {
    if (this.#composePresenter === null) {
      this.#MessageView.message = Messages.LOADING;
    } else {
      this.#composePresenter.removeSortForm();
      this.#MessageView.message = this.#composePresenter.getFilterName();
    }
    render(this.#MessageView, this.#eventsContainer);
  };

  #renderPointsList = (points) => {
    remove(this.#pointsListView);
    if (points.length === 0) {
      this.#showMessage();
      return;
    }
    if (this.#eventsContainer.contains(this.#MessageView.element)) {
      remove(this.#MessageView);
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
        this.#pointDeleteHandler,
        this.#closeCurrentPointForm
      )
      .renderPoint();
    return pointPresenter;
  };

  #createNewEvent = () => {
    //this.#disableNewEventButton();
    this.#closeCurrentPointForm();
    const pointPresenter = this.#renderPoint(this.#model.newPoint);
    pointPresenter.setOnEscClickHandler();
    this.#setCurrentPointPresenter(pointPresenter);
    /* add predicate , which controls this condition
    if (this.#model.pointsLength === 0) {
      remove(this.#noPointsMessageView);
      render(this.#pointsListView, this.#eventsContainer);
    }*/
    remove(this.#MessageView);
    render(this.#pointsListView, this.#eventsContainer);
  };

  #enableNewEventButton = () => {
    this.#newEventButton.disabled = false;
  };

  #disableNewEventButton = () => {
    this.#newEventButton.disabled = true;
  };
}
