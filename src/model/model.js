import { getDemoPoint, getDemoOffers, getDemoDestinations } from '../mock/mock';
import { POINTS_COUNT } from '../settings';
import { getCurrentDateTime } from '../util';
import Filter from '../services/filter';
import Sorter from '../services/sorter';
import EventManager from '../services/notifier';
import { POINT_TYPES } from '../settings';

const modelEvents = {
  DELETE_POINT: 'delete_point',
  UPDATE_LIST: 'update_list',
};

const getMock = () => ({
  points: Array.from({ length: POINTS_COUNT }, (element, index) =>
    getDemoPoint(index)
  ),
  offers: getDemoOffers(),
  destinations: getDemoDestinations(),
});

export default class Model {
  #points = [];
  #offers = [];
  #destinations = [];
  #loaded = false;
  #filter = null;
  #sorter = null;
  #eventManager = null;

  constructor(args) {
    const { filter, sorter, notifier: eventManager } = args;
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
  }

  #getData = () => {
    if (this.#loaded) {
      return;
    }
    this.#loaded = true;
    const { points, offers, destinations } = getMock();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  };

  get points() {
    this.#getData();
    return this.#points.map((point) => ({ ...point }));
  }

  get pointsLength() {
    return this.#points.length;
  }

  get offers() {
    this.#getData();
    return this.#offers.map((offer) => ({ ...offer }));
  }

  get destinations() {
    this.#getData();
    return this.#destinations.map((dest) => ({ ...dest }));
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
