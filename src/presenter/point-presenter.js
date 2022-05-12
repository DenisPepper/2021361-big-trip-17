import { render } from '../framework/render';

export default class PointPresenter {
  #point;
  #pointsListView;
  #pointRowView;
  #pointFormView;

  constructor(args) {
    const { point, pointRowView, pointFormView, pointsListView } = args;
    this.#point = point;
    this.#pointRowView = pointRowView;
    this.#pointFormView = pointFormView;
    this.#pointsListView = pointsListView;
  }

  renderPoint = () => {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#pointsListView.closePointForm(this.#pointFormView, this.#pointRowView);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.#pointRowView.setEditClickHandler(() => {
      this.#pointsListView.openPointForm(this.#pointFormView, this.#pointRowView);
      document.addEventListener('keydown', onEscKeyDown);
    });

    this.#pointFormView.setCloseClickHandler(() => {
      this.#pointsListView.closePointForm(this.#pointFormView, this.#pointRowView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#pointFormView.setSaveClickHandler(() => {
      this.#pointsListView.closePointForm(this.#pointFormView, this.#pointRowView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(this.#pointRowView, this.#pointsListView.element);
  };
}
