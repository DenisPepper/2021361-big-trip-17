import Filter from '../services/filter';
import Sorter from '../services/sorter';
import EventManager from '../services/notifier';
import Loader from '../services/loader';
import Adapter from '../services/adapter';

const modelEvents = {
  DELETE_POINT: 'delete_point',
  UPDATE_LIST: 'update_list',
  AFTER_LOAD: 'after_load',
};

export default class Model {
  #points = [];
  #offers = [];
  #destinations = [];
  #filter = null;
  #sorter = null;
  #eventManager = null;
  #loader = null;
  #loaderState = {
    points: { wasRequested: false },
    offers: { wasRequested: false },
    destinations: { wasRequested: false },
  };

  #adapter = null;

  constructor(
    filter = new Filter(),
    sorter = new Sorter(),
    eventManager = new EventManager(),
    loader = new Loader(),
    adapter = new Adapter()
  ) {
    if (filter instanceof Filter) {
      this.#filter = filter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Filter}`);
    }
    if (sorter instanceof Sorter) {
      this.#sorter = sorter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Sorter}`);
    }
    if (eventManager instanceof EventManager) {
      this.#eventManager = eventManager;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${EventManager}`);
    }
    if (loader instanceof Loader) {
      this.#loader = loader;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Loader}`);
    }
    if (adapter instanceof Adapter) {
      this.#adapter = adapter;
    } else {
      throw new Error(`IllegalArgumentException! expected: ${Adapter}`);
    }
  }

  init = () => {
    this.#loader.getPoints(this.setPoints);
    this.#loader.getDestinations(this.setDestinations);
    this.#loader.getOffers(this.setOffers);
  };

  get points() {
    return this.#points.map((point) => ({ ...point }));
  }

  setPoints = (args) => {
    if (args) {
      const { ok, data } = args;
      this.#points = data;
      this.#loaderState.points.wasRequested = true;
      this.#loaderState.points.ok = ok;
      this.#checkLoader();
    }
  };

  get offers() {
    return this.#offers.map((offer) => ({ ...offer }));
  }

  setOffers = (args) => {
    if (args) {
      const { ok, data } = args;
      this.#offers = data;
      this.#loaderState.offers.wasRequested = true;
      this.#loaderState.offers.ok = ok;
      this.#checkLoader();
    }
  };

  get destinations() {
    return this.#destinations.map((dest) => ({ ...dest }));
  }

  setDestinations = (args) => {
    if (args) {
      const { ok, data } = args;
      this.#destinations = data;
      this.#loaderState.destinations.wasRequested = true;
      this.#loaderState.destinations.ok = ok;
      this.#checkLoader();
    }
  };

  get loaderState() {
    return { ...this.#loaderState };
  }

  #checkLoader = () => {
    for (const key in this.#loaderState) {
      if (!this.#loaderState[key].wasRequested) {
        return;
      }
    }
    this.#adaptPointsForClient();
    this.#notify(modelEvents.AFTER_LOAD, this);
  };

  #adaptPointsForClient = () => {
    this.#points = this.#adapter.pointsForClient(
      this.#points,
      this.#destinations
    );
  };

  get newPoint() {
    return this.#adapter.getNewPoint();
  }

  #validate = (point) => {
    delete point.isNew;
    return point;
  };

  addPoint = (point, args) => {
    this.#points = [this.#validate(point), ...this.#points];
    this.#notify(modelEvents.UPDATE_LIST, args);
  };

  deletePoint = (point, args) => {
    const index = this.#points.findIndex((element) => element.id === point.id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this.#notify(modelEvents.DELETE_POINT, args);
  };

  updatePoint = (point, args) => {
    const index = this.#points.findIndex((element) => element.id === point.id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      this.#validate(point),
      ...this.#points.slice(index + 1),
    ];
    this.#notify(modelEvents.UPDATE_LIST, args);
  };

  #filtrate = (filterName) => this.#filter.run(this.points, filterName);

  #sorting = (points = this.points, sortName) =>
    this.#sorter.run(points, sortName);

  compose = (filterName, sortName) =>
    this.#sorting(this.#filtrate(filterName), sortName);

  addDeletePointListener = (callback) =>
    this.#eventManager.add(modelEvents.DELETE_POINT, callback);

  addUpdatePointsListener = (callback) =>
    this.#eventManager.add(modelEvents.UPDATE_LIST, callback);

  addLoaderListener = (callback) =>
    this.#eventManager.add(modelEvents.AFTER_LOAD, callback);

  #notify = (name, args) => this.#eventManager.invoke(name, args);
}
