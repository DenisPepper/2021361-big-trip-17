import Filter from '../services/filter';
import Sorter from '../services/sorter';
import EventManager from '../services/notifier';
import Loader from '../services/loader';
import Adapter from '../services/adapter';

const modelEvents = {
  DELETE_POINT: 'delete_point',
  UPDATE_POINT: 'update_list',
  BEFORE_LOAD: 'before_load',
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
    this.#notify(modelEvents.BEFORE_LOAD, this);
    this.#loader.getPoints(this.#loadPointsHandler);
    this.#loader.getDestinations(this.loadDestinationsHandler);
    this.#loader.getOffers(this.loadOffersHandler);
  };

  get points() {
    return this.#points.map((point) => ({ ...point }));
  }

  #loadPointsHandler = (response) => {
    if (response) {
      const { ok, data } = response;
      this.#points = data;
      this.#loaderState.points.wasRequested = true;
      this.#loaderState.points.ok = ok;
      this.#checkLoader();
    }
  };

  get offers() {
    return this.#offers.map((offer) => ({ ...offer }));
  }

  loadOffersHandler = (response) => {
    if (response) {
      const { ok, data } = response;
      this.#offers = data;
      this.#loaderState.offers.wasRequested = true;
      this.#loaderState.offers.ok = ok;
      this.#checkLoader();
    }
  };

  get destinations() {
    return this.#destinations.map((dest) => ({ ...dest }));
  }

  loadDestinationsHandler = (response) => {
    if (response) {
      const { ok, data } = response;
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
    this.#convertAllPointsForClient();
    this.#notify(modelEvents.AFTER_LOAD, this);
  };

  #convertAllPointsForClient = () => {
    this.#points = this.#points.map((point) =>
      this.#convertPointForClient(point)
    );
  };

  #convertPointForClient = (point) => this.#adapter.PointForClient(point);

  #convertPointForServer = (point) => this.#adapter.pointForServer(point);

  get newPoint() {
    return this.#adapter.getNewPoint();
  }

  addPoint = (point, args) => {
    this.#points = [point, ...this.#points];
    this.#notify(modelEvents.UPDATE_POINT, args);
  };

  #deletePointHandler = (response, args) => {
    if (!response.ok) {
      return;
    }
    const {id} = response;
    const index = this.#points.findIndex((element) => element.id === id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this.#notify(modelEvents.DELETE_POINT, args);
  };

  deletePoint = (point, args) => {
    this.#loader.deletePoint(point,
      this.#deletePointHandler,
      args
    );
  };

  #updatePointHandler = (response, args) => {
    if (!response.ok) {
      return;
    }
    const point = this.#convertPointForClient(response.data);
    const index = this.#points.findIndex((element) => element.id === point.id);
    if (index === -1) {
      throw new Error('index of point not found');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      point,
      ...this.#points.slice(index + 1),
    ];
    this.#notify(modelEvents.UPDATE_POINT, args);
  };

  updatePoint = (point, args) => {
    this.#loader.updatePoint(
      this.#convertPointForServer(point),
      this.#updatePointHandler,
      args
    );
  };

  #filtrate = (filterName) => this.#filter.run(this.points, filterName);

  #sorting = (points = this.points, sortName) =>
    this.#sorter.run(points, sortName);

  compose = (filterName, sortName) =>
    this.#sorting(this.#filtrate(filterName), sortName);

  addDeletePointListener = (callback) =>
    this.#eventManager.add(modelEvents.DELETE_POINT, callback);

  addPointsUpdatedListener  = (callback) =>
    this.#eventManager.add(modelEvents.UPDATE_POINT, callback);

  addAfterLoadListener = (callback) =>
    this.#eventManager.add(modelEvents.AFTER_LOAD, callback);

  addBeforeLoadListener = (callback) =>
    this.#eventManager.add(modelEvents.BEFORE_LOAD, callback);

  #notify = (name, args) => this.#eventManager.invoke(name, args);
}
