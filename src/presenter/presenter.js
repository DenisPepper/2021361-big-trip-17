import PointForm from '../view/point-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import PointRow from '../view/point-row-view';
import PointsList from '../view/points-list-view';
import { render } from '../render';
import { POINTS_COUNT } from '../const';

export default class Presentor {
  #points = [];
  #offers = [];
  #destinations = [];
  #pointsListView;

  constructor(points, offers, destinations) {
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = () => {
    const controlsContainer = document.querySelector('.trip-controls__filters');
    const eventsContainer = document.querySelector('.trip-events');
    this.#pointsListView = new PointsList();

    render(new FiltersForm(), controlsContainer);

    render(new SortForm(), eventsContainer);

    render(this.#pointsListView, eventsContainer);

    for (let i = 0; i < POINTS_COUNT; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderPoint = (point) => {
    const pointRowView = new PointRow(point, this.#offers, this.#destinations);
    const pointFormView = new PointForm(
      point,
      this.#offers,
      this.#destinations
    );

    const openPointForm = () => {
      this.#pointsListView.element.replaceChild(
        pointFormView.element,
        pointRowView.element
      );
    };

    const closePointForm = () => {
      this.#pointsListView.element.replaceChild(
        pointRowView.element,
        pointFormView.element
      );
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePointForm();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointRowView.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        openPointForm();
        document.addEventListener('keydown', onEscKeyDown);
      });

    pointFormView.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        closePointForm();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    pointFormView.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      closePointForm();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointRowView, this.#pointsListView.element);
  };
}
