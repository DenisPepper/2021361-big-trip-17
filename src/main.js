import Model from './model/model';
import MainPresenter from './presenter/main-presenter';
import PointsList from './view/points-list-view';
import FiltersForm from './view/filters-view';
import SortForm from './view/sorts-view';
import NoPointsMessage from './view/no-point-message-view';
import Filter from './services/filter';
import Sorter from './services/sorter';
import Notifier from './services/notifier';

const mainPresenter = new MainPresenter({
  model: new Model({
    filter: new Filter(),
    sorter: new Sorter(),
    notifier: new Notifier(),
  }),
  pointsListView: new PointsList(),
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
  newEventButton: document.querySelector('.trip-main__event-add-btn'),
  filtersFormView: new FiltersForm(),
  sortFormView: new SortForm(),
  noPointsMessageView: new NoPointsMessage(),
});

mainPresenter.init();
