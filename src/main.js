import Presentor from './presenter/presenter';
import PointModel from './model/model';
const containers = {
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
};

const presentor = new Presentor();
presentor.init(new PointModel().mock, containers);
