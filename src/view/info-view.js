import { createInfoTemplate } from '../templates/info-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const DefaultState = {
  title: 'Big trip from to',
  dates: 'date from to',
  cost: 0,
};

export default class Info extends AbstractStatefulView {
  #elements = new Map();
  _state;

  constructor() {
    super();
    this._state = DefaultState;
    this.init();
  }

  init = () => {
    this.#findElements();
  };

  #findElements = () => {
    this.#elements.set('title', this.element.querySelector('.trip-info__title'));
    this.#elements.set('dates', this.element.querySelector('.trip-info__dates'));
    this.#elements.set('cost', this.element.querySelector('.trip-info__cost-value'));
  };

  _restoreHandlers = () =>{};

  get template() {
    return createInfoTemplate(this._state);
  }

  get defaultTitle() {
    return DefaultState.title;
  }

  get defaultDates() {
    return DefaultState.dates;
  }

  /*get state() {
    const data = { ...this._state };
    return data;
  }

  set state(data) {
    this._state = { ...data };
  }*/

  update = (data) => this.updateElement({ ... data});

}
