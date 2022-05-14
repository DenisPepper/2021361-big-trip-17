import Model from './model/model';
import MainPresenter from './presenter/main-presenter';
import PointsList from './view/points-list-view';
import FiltersForm from './view/filters-view';
import SortForm from './view/sorts-view';
import NoPointsMessage from './view/no-point-message-view';

const mainPresenter = new MainPresenter({
  model: new Model(),
  pointsListView: new PointsList(),
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
  filtersFormView: new FiltersForm(),
  sortFormView: new SortForm(),
  noPointsMessageView: new NoPointsMessage(),
});
mainPresenter.init();
mainPresenter.refreshPointsList();
