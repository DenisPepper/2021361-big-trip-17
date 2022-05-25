import { render, replace } from '../framework/render';

export default class PointPresenter {
  #point = null;
  #pointsListView = null;
  #pointRowView = null;
  #pointFormView = null;
  #callback = {
    updatePointRowView: null,
    closeCurrentPointForm: null,
    resetThisInMainPresenter: null,
  };

  constructor(args) {
    const { point, pointRowView, pointFormView, pointsListView } = args;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  #closePointForm = () => replace(this.#pointRowView, this.#pointFormView);

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  removeOnEscClickHandler = () =>
    document.removeEventListener('keydown', this.#onEscKeyDown);

  #setFavoriteClickHandler = () => {
    this.#pointRowView.setFavoriteClickHandler(() => {
      this.#point.isFavorite = !this.#point.isFavorite;
      this.#callback.updatePointRowView(this);
    });
  };

  #setEditClickHandler = () => {
    this.#pointRowView.setEditClickHandler(() => {
      this.#callback.closeCurrentPointForm(this);
      this.#openPointForm();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });
  };

  #setCloseClickHandler = () => {
    this.#pointFormView.setCloseClickHandler(() => {
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });
  };

  #setSaveClickHandler = () => {
    this.#pointFormView.setSaveClickHandler(() => {
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });
  };

  get pointRowView() {
    return this.#pointRowView;
  }

  set pointRowView(pointRowView) {
    this.#pointRowView = pointRowView;
    this.#setFavoriteClickHandler();
    this.#setEditClickHandler();
    this.#setCloseClickHandler();
    this.#setSaveClickHandler();
  }

  get pointFormView() {
    return this.#pointFormView;
  }

  get point() {
    return this.#point;
  }

  init = (
    updatePointRowView,
    closeCurrentEditView,
    resetCurrentPointPresenter
  ) => {
    this.#callback.updatePointRowView = updatePointRowView;
    this.#callback.closeCurrentPointForm = closeCurrentEditView;
    this.#callback.resetThisInMainPresenter = resetCurrentPointPresenter;
    this.#setFavoriteClickHandler();
    this.#setEditClickHandler();
    this.#setCloseClickHandler();
    this.#setSaveClickHandler();
  };

  renderPoint = () => {
    render(this.#pointRowView, this.#pointsListView.element);
  };
}
