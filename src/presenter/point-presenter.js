import { render, replace, remove } from '../framework/render';
import { Actions } from '../settings';

export default class PointPresenter {
  #model = null;
  #point = null;
  #pointsListView = null;
  #pointRowView = null;
  #pointFormView = null;
  #callback = {
    setCurrentPointPresenter: null,
    resetCurrentPointPresenter: null,
  };

  constructor(args) {
    const { model, point, pointRowView, pointFormView, pointsListView } = args;
    this.#model = model;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  init = (setCurrentPointPresenter, resetCurrentPointPresenter) => {
    this.#callback.setCurrentPointPresenter = setCurrentPointPresenter;
    this.#callback.resetCurrentPointPresenter = resetCurrentPointPresenter;
    this.#pointRowView.setEditClickCallback(this.#whenEditClick);
    this.#pointRowView.setFavoriteClickCallback(this.#whenFavoriteClick);
    this.#pointFormView.setCloseClickCallback(this.#whenCloseClick);
    this.#pointFormView.setSaveClickCallback(this.#whenSaveClick);
    this.#pointFormView.setResetClickCallback(this.#whenResetClick);
  };

  #whenEditClick = () => {
    this.#callback.setCurrentPointPresenter(this);
    this.#openPointForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #whenFavoriteClick = (point) => {
    this.#model.updatePoint(point, { eventName: ''});
  };

  #whenCloseClick = () => {
    this.#callback.resetCurrentPointPresenter();
    this.#pointFormView.resetState(this.#point);
    this.closePointForm();
    this.removeOnEscClickHandler();
  };

  #whenSaveClick = () => {
    this.#callback.resetCurrentPointPresenter();
    this.closePointForm();
    this.removeOnEscClickHandler();
  };

  #whenResetClick = (point) => {
    this.#model.deletePoint(point, {
      eventName: Actions.DELETE_POINT,
      pointPresenter: this,
    });
    this.removeOnEscClickHandler();
  };

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  closePointForm = () => replace(this.#pointRowView, this.#pointFormView);

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

  removeOnEscClickHandler = () =>
    document.removeEventListener('keydown', this.#onEscKeyDown);

  renderPoint = () => {
    render(this.#pointRowView, this.#pointsListView.element);
  };
}
