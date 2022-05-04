import Presentor from './presenter/presenter';
import Model from './model/model';
const containers = {
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
};

const presentor = new Presentor();
const model = new Model();
presentor.init(model.data, containers);
