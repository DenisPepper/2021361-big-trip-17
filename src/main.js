import Model from './model/model';
import MainPresenter from './presenter/main-presenter';
import PointsList from './view/points-list-view';
import FiltersForm from './view/filters-view';
import SortForm from './view/sorts-view';
import NoPointsMessage from './view/no-point-message-view';
import PointForm from './view/point-form-view';
import PointRow from './view/point-row-view';

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
mainPresenter.points.forEach((point) => {
  const pointRowView = new PointRow(
    point,
    mainPresenter.offers,
    mainPresenter.destinations
  );
  const pointFormView = new PointForm(
    point,
    mainPresenter.offers,
    mainPresenter.destinations
  );
  mainPresenter.addPointToPointList(point, pointRowView, pointFormView);
});
mainPresenter.renderPointsList();
