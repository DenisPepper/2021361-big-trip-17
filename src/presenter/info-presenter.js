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

    const title = count > 3 ? this.#getTitleIsThreeDot(points) : this.#infoView.defaultTitle;
    this.#title = count > 0 && count <= 3 ? this.#getTitleIsDash(points) : title;

    this.#dates = count > 0 ? this.#getDates(points) : this.#infoView.defaultDates;
  };

  #getDates = (points) => `${getDayOf(points[0].dateFrom)} — ${getDayOf(points[points.length - 1].dateTo)}`;

  #getTitleIsThreeDot = (points) => `${points[0].destination.name} ... ${points[points.length - 1].destination.name}`;

  #getTitleIsDash = (points) => points.reduce((i, point) => `${i} — ${point.destination.name}`, '').slice(2);

  increaseTotalCost = (totalPrice) => {this.#totalCost += totalPrice;};

  reduceTotalCost = (totalPrice) => {this.#totalCost -= totalPrice;};

  renderInfoView = () => {
    render(this.#infoView, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };
}
