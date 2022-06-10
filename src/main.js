import Model from './model/model';
import MainPresenter from './presenter/main-presenter';
import PointsList from './view/points-list-view';
import FiltersForm from './view/filters-view';
import SortForm from './view/sorts-view';
import Message from './view/message-view';

const mainPresenter = new MainPresenter({
  model: new Model(),
  pointsListView: new PointsList(),
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
  newEventButton: document.querySelector('.trip-main__event-add-btn'),
  filtersFormView: new FiltersForm(),
  sortFormView: new SortForm(),
  MessageView: new Message(),
});

mainPresenter.init();
