import PointForm from '../view/point-form-view';
import PointRow from '../view/point-row-view';
import { POINTS_COUNT } from '../const';
import { render } from '../framework/render';

export default class MainPresenter {
  #model;
  #pointsListView;
  #controlsContainer;
  #eventsContainer;
  #filtersFormView;
  #sortFormView;
  #noPointsMessageView;

  constructor(args) {
    const {
      model,
      pointsListView,
      controlsContainer,
      eventsContainer,
      filtersFormView,
      sortFormView,
      noPointsMessageView,
    } = args;
    this.#model = model;
    this.#pointsListView = pointsListView;
    this.#controlsContainer = controlsContainer;
    this.#eventsContainer = eventsContainer;
    this.#filtersFormView = filtersFormView;
    this.#sortFormView = sortFormView;
    this.#noPointsMessageView = noPointsMessageView;
    model.getData();
  }

  init = () => {
    render(this.#filtersFormView, this.#controlsContainer);

    render(this.#sortFormView, this.#eventsContainer);

    if (this.#model.points.length > 0) {
      render(this.#pointsListView, this.#eventsContainer);
      for (let i = 0; i < POINTS_COUNT; i++) {
        this.#renderPoint(this.#model.points[i]);
      }
    } else {
      render(this.#noPointsMessageView, this.#eventsContainer);
    }
  };

  #renderPoint = (point) => {
    const pointRowView = new PointRow(
      point,
      this.#model.offers,
      this.#model.destinations
    );
    const pointFormView = new PointForm(
      point,
      this.#model.offers,
      this.#model.destinations
    );

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#pointsListView.closePointForm(pointFormView, pointRowView);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointRowView.setEditClickHandler(() => {
      this.#pointsListView.openPointForm(pointFormView, pointRowView);
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointFormView.setCloseClickHandler(() => {
      this.#pointsListView.closePointForm(pointFormView, pointRowView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointFormView.setSaveClickHandler(() => {
      this.#pointsListView.closePointForm(pointFormView, pointRowView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointRowView, this.#pointsListView.element);
  };
}
