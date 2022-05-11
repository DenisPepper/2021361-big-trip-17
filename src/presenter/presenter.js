import PointForm from '../view/point-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import PointRow from '../view/point-row-view';
import PointsList from '../view/points-list-view';
import NoPointsMessage from '../view/no-point-message-view';
import { POINTS_COUNT } from '../const';
import { render } from '../framework/render';

export default class Presentor {
  #model;
  #pointsListView;
  #controlsContainer;
  #eventsContainer;
  #filtersFormView;
  #sortFormView;
  #noPointsMessage;

  constructor(model) {
    this.#pointsListView = new PointsList();
    this.#model = model;
    model.getData();
  }

  init = () => {
    this.#controlsContainer = document.querySelector('.trip-controls__filters');
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filtersFormView = new FiltersForm();
    this.#sortFormView = new SortForm();
    this.#noPointsMessage = new NoPointsMessage();

    render(this.#filtersFormView, this.#controlsContainer);

    render(this.#sortFormView, this.#eventsContainer);

    if (this.#model.points.length > 0) {
      render(this.#pointsListView, this.#eventsContainer);
      for (let i = 0; i < POINTS_COUNT; i++) {
        this.#renderPoint(this.#model.points[i]);
      }
    } else {
      render(this.#noPointsMessage, this.#eventsContainer);
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
