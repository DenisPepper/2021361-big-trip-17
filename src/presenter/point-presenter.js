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
    whenDeletePoint: () => {},
  };

  constructor(args) {
    const { model, point, pointRowView, pointFormView, pointsListView } = args;
    this.#model = model;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  init = (setCurrentPointPresenter, resetCurrentPointPresenter, whenDeletePoint) => {
    this.#callback.setCurrentPointPresenter = setCurrentPointPresenter;
    this.#callback.resetCurrentPointPresenter = resetCurrentPointPresenter;
    this.#callback.whenDeletePoint = whenDeletePoint;
    this.#pointRowView.setEditClickHandler(this.#editClickHandler);
    this.#pointRowView.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#pointFormView.setCloseClickHandler(this.#closeClickHandler);
    this.#pointFormView.setSaveClickHandler(this.#saveClickHandler);
    this.#pointFormView.setResetClickHandler(this.#resetClickHandler);
    return this;
  };

  #editClickHandler = () => {
    this.#callback.setCurrentPointPresenter(this);
    this.#openPointForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #favoriteClickHandler = (point) => {
    this.#model.updatePoint(point, { eventName: null });
  };

  #closeClickHandler = () => {
    this.#callback.resetCurrentPointPresenter();
    this.#pointFormView.resetState(this.#point);
    this.closePointForm();
    this.removeOnEscClickHandler();
  };

  #saveClickHandler = (point) => {
    this.#callback.resetCurrentPointPresenter();
    this.closePointForm();
    this.removeOnEscClickHandler();
    if (this.#point.isNew) {
      this.#model.addPoint(point);
    } else {
      this.#model.updatePoint(point);
    }
  };

  #resetClickHandler = (point) => {
    this.#model.deletePoint(point, {
      pointPresenter: this,
    });
    this.removeOnEscClickHandler();
  };

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  closePointForm = () => {
    if (this.#point.isNew) {
      this.#callback.whenDeletePoint({pointPresenter: this});
    } else {
      replace(this.#pointRowView, this.#pointFormView);
    }
  };

  clear = () => {
    remove(this.#pointFormView);
    remove(this.#pointRowView);
    this.#pointFormView = null;
    this.#pointRowView = null;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#callback.resetCurrentPointPresenter();
      this.#pointFormView.resetState(this.#point);
      this.closePointForm();
      this.removeOnEscClickHandler();
    }
  };

  setOnEscClickHandler = () => document.addEventListener('keydown', this.#onEscKeyDown);

  removeOnEscClickHandler = () => document.removeEventListener('keydown', this.#onEscKeyDown);

  renderPoint = () => {
    if (this.#point.isNew) {
      render(this.#pointFormView, this.#pointsListView.element, 'afterbegin');
    } else {
      render(this.#pointRowView, this.#pointsListView.element);
    }
    return this;
  };
}
