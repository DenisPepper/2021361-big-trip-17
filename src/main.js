import Presentor from './presenter/presenter';
import Model from './model/model';

const model = new Model();
const { points, offers, destinations } = model.data;
const presentor = new Presentor(points, offers, destinations);
presentor.init();
