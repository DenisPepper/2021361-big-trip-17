import { render, replace } from '../framework/render';

export default class PointPresenter {
  #point = null;
  #pointsListView = null;
  #pointRowView = null;
  #pointFormView = null;
  #callback = {
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

  init = (closeCurrentEditView, resetCurrentPointPresenter) => {
    this.#callback.closeCurrentPointForm = closeCurrentEditView;
    this.#callback.resetThisInMainPresenter = resetCurrentPointPresenter;
    this.#pointRowView.setEditClickCallback(this.#editClickCallback);
    this.#setCloseClickHandler();
    this.#setSaveClickHandler();
  };

  #editClickCallback = () => {
    this.#callback.closeCurrentPointForm(this);
    this.#openPointForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #openPointForm = () => replace(this.#pointFormView, this.#pointRowView);

  #closePointForm = () => replace(this.#pointRowView, this.#pointFormView);

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      this.removeOnEscClickHandler();
    }
  };

  removeOnEscClickHandler = () =>
    document.removeEventListener('keydown', this.#onEscKeyDown);

  #setCloseClickHandler = () => {
    this.#pointFormView.setCloseClickHandler(() => {
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      this.removeOnEscClickHandler();
    });
  };

  #setSaveClickHandler = () => {
    this.#pointFormView.setSaveClickHandler(() => {
      this.#callback.resetThisInMainPresenter();
      this.#closePointForm();
      this.removeOnEscClickHandler();
    });
  };

  get pointRowView() {
    return this.#pointRowView;
  }

  get pointFormView() {
    return this.#pointFormView;
  }

  renderPoint = () => {
    render(this.#pointRowView, this.#pointsListView.element);
  };
}
