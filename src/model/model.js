import { getCurrentDateTime } from '../util';
import Filter from '../services/filter';
import Sorter from '../services/sorter';
import EventManager from '../services/notifier';
import Loader from '../services/loader';
import { POINT_TYPES } from '../settings';

const modelEvents = {
  DELETE_POINT: 'delete_point',
  UPDATE_LIST: 'update_list',
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
    pointsIsLoad: false,
    offersIsLoad: false,
    destinationsIsLoad: false,
  };

  constructor(args) {
    const { filter, sorter, eventManager, loader } = args;
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
  }

  init = () => {
    this.#loader.getPoints(this.setPoints);
    this.#loader.getDestinations(this.setDestinations);
    this.#loader.getOffers(this.setOffers);
  };

  get points() {
    return this.#points.map((point) => ({ ...point }));
  }

  setPoints = (points) => {
    if (points) {
      this.#points = points;
      this.#loaderState.pointsIsLoad = true;
      this.#loaderCheck();
    }
  };

  get offers() {
    return this.#offers.map((offer) => ({ ...offer }));
  }

  setOffers = (offers) => {
    if (offers) {
      this.#offers = offers.map((element) => this.#validate(element));
      this.#loaderState.offersIsLoad = true;
      this.#loaderCheck();
    }
  };

  get destinations() {
    return this.#destinations.map((dest) => ({ ...dest }));
  }

  setDestinations = (destinations) => {
    if (destinations) {
      this.#destinations = destinations;
      this.#loaderState.destinationsIsLoad = true;
      this.#loaderCheck();
    }
  };

  #loaderCheck = () => {
    for (const key in this.#loaderState) {
      if (!this.#loaderState[key]) {
        return;
      }
    }
    this.#notify(modelEvents.UPDATE_LIST, this);
  };

  get pointsLength() {
    return this.#points.length;
  }

  get newPoint() {
    return {
      basePrice: 0,
      dateFrom: getCurrentDateTime(),
      dateTo: getCurrentDateTime(),
      destination: -1,
      id: this.#points.length,
      isFavorite: false,
      offers: [],
      type: POINT_TYPES[0],
      isNew: true,
    };
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

  #notify = (name, args) => this.#eventManager.invoke(name, args);
}
