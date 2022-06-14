import { render } from '../framework/render';
import { RenderPosition } from '../settings';
import { getDayOf } from '../util';

export default class InfoPresenter {
  #infoView;
  #mainContainer;
  #totalCost = 0;
  #title = '';
  #dates = '';

  init = (infoView, mainContainer) => {
    this.#infoView = infoView;
    this.#mainContainer = mainContainer;
    return this;
  };

  updadeInfoView = (points) => {
    this.#generateState(points);
    this.#infoView.update({
      title: this.#title,
      dates: this.#dates,
      cost: this.#totalCost});
    return this;
  };

  #generateState = (points) => {
    const count = points.length;
    let title = this.#infoView.defaultTitle;
    let dates = this.#infoView.defaultDates;
    if (count > 3) {
      title = `${points[0].destination.name} ... ${points[points.length - 1].destination.name}`;
    } else if (count > 0 && count < 4) {
      title = '';
      for (let i = 0; i < count; i++ ) {
        title += ` — ${points[i].destination.name}`;
      }
      title = title.slice(2);
    }
    if (count > 0) {
      dates = `${getDayOf(points[0].dateFrom)} — ${getDayOf(points[points.length - 1].dateTo)}`;
    }
    this.#title = title;
    this.#dates = dates;
  };

  increaseTotalCost = (totalPrice) => {this.#totalCost += totalPrice;};

  reduceTotalCost = (totalPrice) => {this.#totalCost -= totalPrice;};

  renderInfoView = () => {
    render(this.#infoView, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };
}
