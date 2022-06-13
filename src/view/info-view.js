import { createInfoTemplate } from '../templates/info-templ';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class Info extends AbstractStatefulView {
  _state;

  get template() {
    return createInfoTemplate(this._state);
  }

  /*
  #setState = (point) => {
    this._state = { ...point };
  };
  #getState = () => ({ ...this._state });
  */

}
