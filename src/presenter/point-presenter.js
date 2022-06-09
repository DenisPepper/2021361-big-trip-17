import { render, replace, remove } from '../framework/render';

export default class PointPresenter {
  #model = null;
  #point = null;
  #pointsListView = null;
  #pointRowView = null;
  #pointFormView = null;
  #callback = {
    setCurrentPointPresenter: () => {},
    resetCurrentPointPresenter: () => {},
    pointDeleteHandler: () => {},
    closeCurrentPointForm: () => {},
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
    pointDeleteHandler,
    closeCurrentPointForm
  ) => {
    this.#callback.setCurrentPointPresenter = setCurrentPointPresenter;
    this.#callback.resetCurrentPointPresenter = resetCurrentPointPresenter;
    this.#callback.pointDeleteHandler = pointDeleteHandler;
    this.#callback.closeCurrentPointForm = closeCurrentPointForm;
    this.#pointRowView.setEditClickHandler(this.#editClickHandler);
    this.#pointRowView.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#pointFormView.setCloseClickHandler(this.#closeClickHandler);
    this.#pointFormView.setSaveClickHandler(this.#saveClickHandler);
    this.#pointFormView.setResetClickHandler(this.#resetClickHandler);
    return this;
  };

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
    this.#pointFormView.resetState(this.#point);
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

  onLoadErrorHandler = () => {
    this.#pointFormView.onLoadErrorHandler();
  };

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  closePointForm = () => {
    this.removeOnEscClickHandler();
    if (this.#point.isNew) {
      this.#callback.pointDeleteHandler();
    } else {
      this.#callback.resetCurrentPointPresenter();
      replace(this.#pointRowView, this.#pointFormView);
    }
  };

  clear = () => {
    this.#pointFormView.removeEventListeners();
    this.#pointRowView.removeEventListeners();
    remove(this.#pointFormView);
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
      render(this.#pointFormView, this.#pointsListView.element, 'afterbegin');
    } else {
      render(this.#pointRowView, this.#pointsListView.element);
    }
    return this;
  };
}
