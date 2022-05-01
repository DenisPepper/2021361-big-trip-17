import AddPointForm from '../view/add-form-view';
import EditForm from '../view/edit-form-view';
import FiltersForm from '../view/filters-view';
import SortForm from '../view/sorts-view';
import TripPoint from '../view/trip-point-view';
import { render } from '../render';
import { POINTS_COUNT } from '../const';

export default class Presentor {
  init = (containers) => {
    const {tripControlsContainer, tripEventsContainer} = containers;
    render(new FiltersForm(), tripControlsContainer);
    render(new SortForm(), tripEventsContainer);
    render(new EditForm(), tripEventsContainer);
    render(new AddPointForm(), tripEventsContainer);
    let count = 0;
    while (count < POINTS_COUNT) {
      render(new TripPoint(), tripEventsContainer);
      count++;
    }
  };
}
