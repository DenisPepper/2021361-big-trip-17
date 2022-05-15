import PointPresenter from './point-presenter';
import PointForm from '../view/point-form-view';
import PointRow from '../view/point-row-view';
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
    if (this.#model.points.length === 0) {
      render(this.#noPointsMessageView, this.#eventsContainer);
    } else {
      render(this.#pointsListView, this.#eventsContainer);
    }
  };

  renderPointsList = () => {
    this.#model.points.forEach((point) => {
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

      const pointPresenter = new PointPresenter({
        point,
        pointRowView,
        pointFormView,
        pointsListView: this.#pointsListView,
      });

      pointPresenter.renderPoint();
    });
  };
}
