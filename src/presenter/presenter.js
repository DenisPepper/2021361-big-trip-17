import PointForm from '../view/point-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import PointRow from '../view/point-list-view';
import { render } from '../render';
import { POINTS_COUNT } from '../const';

export default class Presentor {
  init = (data, containers) => {
    //const { points, offers, destinations } = data;
    const { controlsContainer, eventsContainer } = containers;

    render(new FiltersForm(), controlsContainer);

    render(new SortForm(), eventsContainer);

    render(new PointForm(data), eventsContainer);

    Array.from({ length: POINTS_COUNT }, () =>
      render(new PointRow(), eventsContainer)
    );
  };
}
