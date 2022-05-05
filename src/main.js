import Presentor from './presenter/presenter';
import Model from './model/model';

const presentor = new Presentor(Model.create());
presentor.init();
