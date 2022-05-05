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

    render(
      new PointForm(this.#points[0], this.#offers, this.#destinations),
      this.#pointsListView.element
    );

    for (let i = 0; i < POINTS_COUNT; i++) {
      render(
        new PointRow(this.#points[i], this.#offers, this.#destinations),
        this.#pointsListView.element
      );
    }
  };
}
