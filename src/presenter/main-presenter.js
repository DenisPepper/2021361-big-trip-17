import PointPresenter from './point-presenter';
import СomposePresenter from './compose-presenter';
import InfoPresenter from './info-presenter';
import Model from '../model/model';
import PointsList from '..//view/points-list-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import Message from '../view/message-view';
import PointRow from '../view/point-row-view';
import PointForm from '../view/point-form-view';
import Info from '../view/info-view';
import { render, remove } from '../framework/render';
import { Messages } from '../settings';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {LOWER_LIMIT: 350, UPPER_LIMIT: 1000};

export default class MainPresenter {
  #model = null;
  #pointsListView = null;
  #mainContainer = null;
  #controlsContainer = null;
  #eventsContainer = null;
  #filtersFormView = null;
  #sortFormView = null;
  #messageView = null;
  #infoView = null;
  #currentPointPresenter = null;
  #composePresenter = null;
  #infoPresenter = null;
  #newEventButton = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #useFiltersCounter = true;

  constructor(args) {
    const {
      model,
      pointsListView,
      mainContainer,
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
      messageView,
      newEventButton,
      infoView,
      infoPresenter,
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

    if (messageView instanceof Message) {
      this.#messageView = messageView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Message}`);
    }

    if (infoView instanceof Info) {
      this.#infoView = infoView;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Info}`);
    }

    if (infoPresenter instanceof InfoPresenter) {
      this.#infoPresenter = infoPresenter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${InfoPresenter}`);
    }

    this.#mainContainer = mainContainer;
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
    this.#model.addPointCreateListener((args) => this.#pointCreateHandler(args));
    this.#model.addDeletePointListener((args) => this.#pointDeleteHandler(args));
    this.#model.addBeforePointsUpdatedListener((args) => this.#beforePointUpdateHandler(args));
    this.#model.addPointsUpdatedListener((args) => this.#pointUpdateHandler(args));
    this.#model.addLoadErrorListener((args) => this.#loadErrorHandler(args));
    this.#model.addBeforeStartListener((args) => this.#beforeStartHandler(args));
    this.#model.addStartListener((args) => this.#startHandler(args));
    this.#model.addFavoriteUpdateListener((args) => this.#favoriteUpdateHandler(args));
    this.#model.addFavoriteUpdateErrorListener((args) => this.#favoriteUpdateErrorHandler(args));
    this.#model.addBeforeLoadListener((args) => this.#beforeLoadHandler(args));
    this.#model.addAfterLoadListener((args) => this.#afterLoadHandler(args));
  };

  #beforeStartHandler = () => {
    this.#enableFiltersCounter();
    this.#showMessage();
  };

  #startHandler = () => {
    const { offers, destinations } = this.#model.loaderState;
    if (offers.ok && destinations.ok) {
      this.#createComposePresenter();
      this.#enableNewEventButton();
      this.#updatePointsList();
      this.#composePresenter.checkFiltersAbsence();
      this.#checkFiltersCounter();
      this.#disableFiltersCounter();
      this.#runInfoPresenter();
    } else {
      this.#messageView.message = Messages.RESTART;
    }
  };

  #beforeLoadHandler = () => {
    this.#uiBlocker.block();
  };

  #afterLoadHandler = () => {
    this.#uiBlocker.unblock();
    this.#composePresenter.checkFiltersAbsence();
    this.#checkFiltersCounter();
  };

  #favoriteUpdateHandler = (args) => {
    const { pointPresenter, point } = args;
    pointPresenter.favoriteUpdateHandler(point);
  };

  #favoriteUpdateErrorHandler = (args) => {
    const { pointPresenter } = args;
    pointPresenter.favoriteUpdateErrorHandler();
    this.#uiBlocker.unblock();
  };

  #loadErrorHandler = () => {
    this.#currentPointPresenter.loadErrorHandler();
    this.#uiBlocker.unblock();
  };

  #pointCreateHandler = (args) => {
    const {point} = args;
    this.#composePresenter.increaseFiltersCounter(point);
    this.#composePresenter.checkFiltersAbsence();
    this.#updatePointsList();
  };

  #beforePointUpdateHandler = () => {
    this.#composePresenter.reduceFilters(this.#currentPointPresenter.point);
  };

  #pointUpdateHandler = (args) => {
    this.#composePresenter.increaseFilters(args.point);
    this.#updatePointsList(args);
  };

  #updatePointsList = () => {
    this.#closeCurrentPointForm();
    if (this.#eventsContainer.contains(this.#messageView.element)) {
      remove(this.#messageView);
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
      .init(this.#updatePointsList)
      .renderFilterForm();
  };

  #runInfoPresenter = () => {
    this.#infoPresenter
      .init(this.#infoView, this.#mainContainer)
      .renderInfoView();
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

  #pointDeleteHandler = (args) => {
    const { point } = args;
    this.#currentPointPresenter.removeOnEscClickHandler();
    this.#currentPointPresenter.revomePointForm();
    this.#resetCurrentPointPresenter();
    this.#composePresenter.reduceFiltersCounter(point);
  };

  #showMessage = () => {
    if (this.#composePresenter === null) {
      this.#messageView.message = Messages.LOADING;
    } else {
      this.#composePresenter.removeSortForm();
      this.#messageView.message = this.#composePresenter.getFilterName();
    }
    render(this.#messageView, this.#eventsContainer);
  };

  /*#showInfo = () => {

  };*/

  #renderPointsList = (points) => {
    remove(this.#pointsListView);
    if (this.#eventsContainer.contains(this.#messageView.element)) {
      remove(this.#messageView);
    }
    points.forEach(this.#renderPoint);
    this.#composePresenter.renderSortForm();
    render(this.#pointsListView, this.#eventsContainer);
  };

  #renderPoint = (point) =>
    this.#createPointPresenter(
      this.#model,
      point,
      new PointRow(point, this.offers, this.destinations),
      new PointForm(point, this.offers, this.destinations)
    ).init(
      this.#setCurrentPointPresenter,
      this.#resetCurrentPointPresenter,
      this.#checkFiltersCounter,
      this.#closeCurrentPointForm
    ).renderPoint();

  #createPointPresenter = (model, point, pointRowView, pointFormView) => {
    const pointPresenter = new PointPresenter({
      model,
      point,
      pointRowView,
      pointFormView,
      pointsListView: this.#pointsListView,
    });
    if (this.#useFiltersCounter) {
      this.#composePresenter.increaseFiltersCounter(point);
    }
    return pointPresenter;
  };

  #createNewEvent = () => {
    this.#closeCurrentPointForm();
    if (this.#eventsContainer.contains(this.#messageView.element)) {
      remove(this.#messageView);
      this.#composePresenter.renderSortForm();
      render(this.#pointsListView, this.#eventsContainer);
    }
    const pointPresenter = this.#renderPoint(this.#model.newPoint);
    pointPresenter.setOnEscClickHandler();
    this.#setCurrentPointPresenter(pointPresenter);
  };

  #enableNewEventButton = () => {
    this.#newEventButton.disabled = false;
  };

  #disableNewEventButton = () => {
    this.#newEventButton.disabled = true;
  };

  #disableFiltersCounter = () => {
    this.#useFiltersCounter = false;
  };

  #enableFiltersCounter = () => {
    this.#useFiltersCounter = true;
  };

  #checkFiltersCounter = () => {
    if (this.#composePresenter.getCount() === 0) {
      this.#showMessage();
    }
  };
}
