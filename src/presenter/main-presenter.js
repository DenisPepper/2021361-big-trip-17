import PointPresenter from './point-presenter';
import ComposePresenter from './compose-presenter';
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
  #points = [];
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
  #useTotalCostCounter = true;

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

    this.#model = this.#isInstanceOf(model, Model);
    this.#pointsListView = this.#isInstanceOf(pointsListView, PointsList);
    this.#filtersFormView = this.#isInstanceOf(filtersFormView, FiltersForm);
    this.#sortFormView = this.#isInstanceOf(sortFormView, SortForm);
    this.#messageView = this.#isInstanceOf(messageView, Message);
    this.#infoView = this.#isInstanceOf(infoView, Info);
    this.#infoPresenter = this.#isInstanceOf(infoPresenter, InfoPresenter);
    this.#mainContainer = mainContainer;
    this.#controlsContainer = controlsContainer;
    this.#eventsContainer = eventsContainer;
    this.#newEventButton = newEventButton;
  }

  #isInstanceOf = (arg, type) => arg instanceof type ? arg : this.#throwTypeError(type);

  #throwTypeError = (type) => {throw new TypeError(`expected: ${type.name}`);};

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
      this.#disableTotalCostCounter();
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
    this.#infoPresenter.updadeInfoView(this.#points);
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
    this.#infoPresenter.increaseTotalCost(args.point.totalPrice);
    this.#updatePointsList();
  };

  #beforePointUpdateHandler = () => {
    this.#composePresenter.reduceFilters(this.#currentPointPresenter.point);
    this.#infoPresenter.reduceTotalCost(this.#currentPointPresenter.point.totalPrice);
  };

  #pointUpdateHandler = (args) => {
    this.#composePresenter.increaseFilters(args.point);
    this.#infoPresenter.increaseTotalCost(args.point.totalPrice);
    this.#updatePointsList(args);
  };

  #updatePointsList = () => {
    this.#points = this.composePointsList();
    this.#renderPointsList();
  };

  composePointsList = () => this.#model.compose(
    this.#composePresenter.getCurrentFilter(),
    this.#composePresenter.getCurrentSort()
  );

  #createComposePresenter = () => {
    this.#composePresenter = new ComposePresenter({
      model: this.#model,
      filtersFormView: this.#filtersFormView,
      sortFormView: this.#sortFormView,
      controlsContainer: this.#controlsContainer,
      eventsContainer: this.#eventsContainer,
    })
      .init(this.#updatePointsList)
      .initForms()
      .renderFilterForm();
  };

  #runInfoPresenter = () => {
    this.#infoPresenter
      .init(this.#infoView, this.#mainContainer)
      .updadeInfoView(this.#points)
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
    this.#points = this.composePointsList();
    this.#currentPointPresenter.removeOnEscClickHandler();
    this.#currentPointPresenter.revomePointForm();
    this.#resetCurrentPointPresenter();
    this.#composePresenter.reduceFiltersCounter(point);
    this.#infoPresenter.reduceTotalCost(point.totalPrice);
  };

  #showMessage = () => {
    if (this.#composePresenter === null) {
      this.#messageView.message = Messages.LOADING;
    } else {
      this.#composePresenter.removeSortForm();
      this.#messageView.message = this.#composePresenter.getCurrentFilter();
    }
    remove(this.#pointsListView);
    render(this.#messageView, this.#eventsContainer);
  };

  #renderPointsList = () => {
    this.#closeCurrentPointForm();
    remove(this.#pointsListView);
    this.#points.forEach(this.#renderPoint);
    if (this.#eventsContainer.contains(this.#messageView.element)) {
      remove(this.#messageView);
      this.#composePresenter.renderSortForm();
    }
    render(this.#pointsListView, this.#eventsContainer);
  };

  #renderPoint = (point) =>
    this.#createPointPresenter(
      this.#model,
      point,
      new PointRow(point, this.offers, this.destinations),
      new PointForm(this.#copyPoint(point), this.offers, this.destinations))
      .init(
        this.#setCurrentPointPresenter,
        this.#resetCurrentPointPresenter,
        this.#checkFiltersCounter,
        this.#closeCurrentPointForm,
        this.#enableNewEventButton,
        this.#copyPoint,
        this.#restoreComposeSettings)
      .renderPoint();

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
    if (this.#useTotalCostCounter) {
      this.#infoPresenter.increaseTotalCost(point.totalPrice);
    }
    return pointPresenter;
  };

  #createNewEvent = () => {
    this.#disableNewEventButton();
    this.#resetComposeSettings();
    this.#closeCurrentPointForm();
    if (this.#eventsContainer.contains(this.#messageView.element)) {
      remove(this.#messageView);
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

  #checkFiltersCounter = () => {
    const count = this.#composePresenter.getCount();
    if (count === 0) {
      this.#showMessage();
    }
    if (count === 2 && !this.#eventsContainer.contains(this.#sortFormView.element)) {
      this.#composePresenter.renderSortForm();
    }
    if (count === 1 && this.#eventsContainer.contains(this.#sortFormView.element)) {
      this.#composePresenter.removeSortForm();
    }
  };

  #disableTotalCostCounter = () => {
    this.#useTotalCostCounter = false;
  };

  #copyPoint = (point) => ({...point, offers: [...point.offers]});

  #resetComposeSettings = () => {
    this.#composePresenter.saveCurrentState();
    this.#composePresenter.setFirstFilterChecked();
    this.#composePresenter.setFirstSortChecked();
  };

  #restoreComposeSettings = () => {
    this.#composePresenter.restoreSavedState();
  };
}
