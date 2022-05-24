import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class SortForm extends AbstractView {
  _callback = {
    setSortsClick: null,
  };

  constructor() {
    super();
    this.init();
  }

  get template() {
    return createSortsFormTemplate();
  }

  init = (callback) => {
    this.element[0].checked = true;
    this.setSortsClickHandler(callback);
  };

  setSortsClickHandler = (callback) => {
    this._callback.setSortsClick = callback;
    this.element.addEventListener('input', this.#setSortsClick);
  };

  #setSortsClick = (evt) => {
    this._callback.setSortsClick(evt.target.value);
  };
}
