import Presentor from './presenter/presenter';
import Model from './model/model';

const presentor = new Presentor(new Model());
presentor.init();
