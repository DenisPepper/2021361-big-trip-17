import Presentor from './presenter/presenter';
const controlsContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const presentor = new Presentor();
presentor.init({ controlsContainer, eventsContainer });
