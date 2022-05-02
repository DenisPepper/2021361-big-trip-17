import Presentor from './presenter/presenter';
const containers = {
  controlsContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events'),
};

const presentor = new Presentor();
presentor.init(containers);
