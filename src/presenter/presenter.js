import AddPointForm from '../view/add-form-view';
import EditForm from '../view/edit-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import TripPoint from '../view/trip-point-view';
import { render } from '../render';
import { POINTS_COUNT } from '../const';

export default class Presentor {
  init = (data, containers) => {
    const { points, offers, destinations} = data;
    const { controlsContainer, eventsContainer } = containers;
    render(new FiltersForm(), controlsContainer);
    render(new SortForm(), eventsContainer);
    render(new EditForm(), eventsContainer);
    render(new AddPointForm(), eventsContainer);
    Array.from({ length: POINTS_COUNT }, () =>
      render(new TripPoint(), eventsContainer)
    );
  };
}
