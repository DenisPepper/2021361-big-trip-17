import Presentor from './presenter/presenter';
const tripControlsContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const presentor = new Presentor();
presentor.init({tripControlsContainer, tripEventsContainer});
