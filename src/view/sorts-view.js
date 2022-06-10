import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class SortForm extends AbstractView {
  _callback = {
    sortsClick: null,
  };

  constructor() {
    super();
    this.init();
  }

  get template() {
    return createSortsFormTemplate();
  }

  init = () => {
    this.element[0].checked = true;
  };

  setSortsClickHandler = (callback) => {
    this._callback.sortsClick = callback;
    this.element.addEventListener('input', this.#sortsClickHandler);
  };

  #sortsClickHandler = (evt) => {
    this._callback.sortsClick(evt.target.value);
  };

  removeSortsClickHandler = () => {
    this.element.removeEventListener('input', this._callback.setSortsClick);
  };

}
