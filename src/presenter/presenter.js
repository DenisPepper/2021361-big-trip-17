import PointForm from '../view/point-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import PointRow from '../view/point-row-view';
import { render } from '../render';
import { POINTS_COUNT } from '../const';

const renderPoints = (callback) => {
  for (let i = 0; i < POINTS_COUNT; i++) {
    callback.apply(this, [i]);
  }
};

export default class Presentor {
  init = (data, containers) => {
    const { points, offers, destinations } = data;
    const { controlsContainer, eventsContainer } = containers;

    render(new FiltersForm(), controlsContainer);

    render(new SortForm(), eventsContainer);

    const eventsListContainer = document.createElement('ul');
    eventsListContainer.classList.add('trip-events__list');
    eventsContainer.append(eventsListContainer);

    renderPoints((...rest) => render(new PointRow(points[rest[0]], offers, destinations), eventsListContainer));
  };
}
