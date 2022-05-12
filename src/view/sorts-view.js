import { createSortsFormTemplate } from '../templates/sorts-form-templ';
import AbstractView from '../framework/view/abstract-view';

export default class SortForm extends AbstractView {
  get template() {
    return createSortsFormTemplate();
  }
}
