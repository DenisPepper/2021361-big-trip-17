import { render, replace, remove } from '../framework/render';
import { RenderPosition } from '../settings';

export default class PointPresenter {
  #model = null;
  #point = null;
  #pointsListView = null;
  #pointRowView = null;
  #pointFormView = null;
  #callback = {
    setCurrentPointPresenter: () => {},
    resetCurrentPointPresenter: () => {},
    checkFiltersCounter: () => {},
    closeCurrentPointForm: () => {},
    enableNewEventButton: () => {},
    copyPoint: () => {},
    restoreComposeSettings: () => {},
  };

  constructor(args) {
    const { model, point, pointRowView, pointFormView, pointsListView } = args;
    this.#model = model;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  init = (
    setCurrentPointPresenter,
    resetCurrentPointPresenter,
    checkFiltersCounter,
    closeCurrentPointForm,
    enableNewEventButton,
    copyPoint,
    restoreComposeSettings,
  ) => {
    this.#callback.restoreComposeSettings = restoreComposeSettings;
    this.#callback.copyPoint = copyPoint;
    this.#callback.enableNewEventButton = enableNewEventButton;
    this.#callback.setCurrentPointPresenter = setCurrentPointPresenter;
    this.#callback.resetCurrentPointPresenter = resetCurrentPointPresenter;
    this.#callback.checkFiltersCounter = checkFiltersCounter;
    this.#callback.closeCurrentPointForm = closeCurrentPointForm;
    this.#pointRowView.setEditClickHandler(this.#editClickHandler);
    this.#pointRowView.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#pointFormView.setCloseClickHandler(this.#closeClickHandler);
    this.#pointFormView.setSaveClickHandler(this.#saveClickHandler);
    this.#pointFormView.setResetClickHandler(this.#resetClickHandler);
    return this;
  };

  get point() {
    return this.#point;
  }

  #editClickHandler = () => {
    this.#callback.closeCurrentPointForm(this);
    this.#callback.setCurrentPointPresenter(this);
    this.#openPointForm();
    this.setOnEscClickHandler();
  };

  #favoriteClickHandler = (point) => {
    this.#model.updateFavorite(point, {pointPresenter: this});
  };

  favoriteUpdateHandler = (point) => {
    this.#point = point;
    this.#pointRowView.favoriteUpdateHandler(this.#point);
  };

  favoriteUpdateErrorHandler = () => {
    this.#pointRowView.favoriteErrorHandler(this.#point);
  };

  #closeClickHandler = () => {
    this.closePointForm();
  };

  #saveClickHandler = (point) => {
    if (this.#point.isNew) {
      this.#model.addPoint(point);
    } else {
      this.#model.updatePoint(point);
    }
  };

  #resetClickHandler = (point) => {
    this.#model.deletePoint(point);
  };

  loadErrorHandler = () => {
    this.#pointFormView.loadErrorHandler();
  };

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  closePointForm = () => {
    this.#callback.resetCurrentPointPresenter();
    this.removeOnEscClickHandler();
    if (this.#point.isNew) {
      this.clear();
      this.#callback.checkFiltersCounter();
      this.#callback.enableNewEventButton();
      this.#callback.restoreComposeSettings();
    } else {
      this.#pointFormView.resetState(this.#callback.copyPoint(this.#point));
      replace(this.#pointRowView, this.#pointFormView);
    }
  };

  revomePointForm = () => {
    remove(this.#pointFormView);
  };

  clear = () => {
    this.#pointFormView.removeEventListeners();
    this.#pointRowView.removeEventListeners();
    this.revomePointForm();
    this.#pointFormView = null;
    this.#pointRowView = null;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeClickHandler();
    }
  };

  setOnEscClickHandler = () =>
    document.addEventListener('keydown', this.#onEscKeyDown);

  removeOnEscClickHandler = () =>
    document.removeEventListener('keydown', this.#onEscKeyDown);

  renderPoint = () => {
    if (this.#point.isNew) {
      render(this.#pointFormView, this.#pointsListView.element, RenderPosition.AFTERBEGIN);
    } else {
      render(this.#pointRowView, this.#pointsListView.element);
    }
    return this;
  };
}
