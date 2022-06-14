import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class SortForm extends AbstractView {
  _callback = {
    sortsClickHandler: () => {},
  };

  get template() {
    return createSortsFormTemplate();
  }

  init = (sortsClickHandler) => {
    this._callback.sortsClickHandler = sortsClickHandler;
    this.setSortsClickHandler();
    this.setFirstChecked();
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

  setFirstChecked = () => {this.element[0].checked = true;};

}
