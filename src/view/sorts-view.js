import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import AbstractView from '../framework/view/abstract-view';
import { Sorts } from '../settings';

export default class SortForm extends AbstractView {
  #elements = new Map();
  _callback = {
    sortsClickHandler: () => {},
  };

  get template() {
    return createSortsFormTemplate();
  }

  init = (sortsClickHandler) => {
    this._callback.sortsClickHandler = sortsClickHandler;
    this.#findElements();
    this.setSortsClickHandler();
    this.setFirstChecked();
  };

  initElement = () => {
    this.#findElements();
    this.setSortsClickHandler();
    this.setFirstChecked();
  };

  #findElements = () => {
    this.#elements.set(Sorts.DAY, this.element.querySelector('#sort-day'));
    this.#elements.set(Sorts.TIME, this.element.querySelector('#sort-time'));
    this.#elements.set(Sorts.PRICE, this.element.querySelector('#sort-price'));
  };

  setSortsClickHandler = () => {
    this.element.addEventListener('input', this.#sortsClickHandler);
  };

  #sortsClickHandler = (evt) => {
    this._callback.sortsClickHandler(evt.target.value);
  };

  removeSortsClickHandler = () => {
    this.element.removeEventListener('input', this._callback.setSortsClick);
  };

  setFirstChecked = () => this.setChecked(Sorts.DAY);

  setChecked = (sort) => {
    const elm = this.#elements.get(sort);
    elm.checked = true;
  };
}
