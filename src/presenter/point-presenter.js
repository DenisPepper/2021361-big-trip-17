import { render } from '../framework/render';

export default class PointPresenter {
  #point;
  #pointsListView;
  #pointRowView;
  #pointFormView;
  #updatePointRowView;

  constructor(args) {
    const { point, pointRowView, pointFormView, pointsListView } = args;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointsListView.closePointForm(
        this.#pointFormView,
        this.#pointRowView
      );
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #setFavoriteClickHandler = () => {
    this.#pointRowView.setFavoriteClickHandler(() => {
      this.#point.isFavorite = !this.#point.isFavorite;
      this.#updatePointRowView(this.#point);
    });
  };

  #setEditClickHandler = () => {
    this.#pointRowView.setEditClickHandler(() => {
      this.#pointsListView.openPointForm(
        this.#pointFormView,
        this.#pointRowView
      );
      document.addEventListener('keydown', this.#onEscKeyDown);
    });
  };

  #setCloseClickHandler = () => {
    this.#pointFormView.setCloseClickHandler(() => {
      this.#pointsListView.closePointForm(
        this.#pointFormView,
        this.#pointRowView
      );
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });
  };

  #setSaveClickHandler = () => {
    this.#pointFormView.setSaveClickHandler(() => {
      this.#pointsListView.closePointForm(
        this.#pointFormView,
        this.#pointRowView
      );
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

  init = (updatePointRowView) => {
    this.#updatePointRowView = updatePointRowView;
    this.#setFavoriteClickHandler();
    this.#setEditClickHandler();
    this.#setCloseClickHandler();
    this.#setSaveClickHandler();
  };

  renderPoint = () => {
    render(this.#pointRowView, this.#pointsListView.element);
  };
}
