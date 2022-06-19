import { render } from '../framework/render';
import { RenderPosition } from '../settings';
import { getDayOf } from '../util';

const TRIP_FROM_THREE_POINTS_COUNT = 3;

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
    const title = this.#isGreaterThenThree(points.length) ? this.#getTitleIsThreeDot(points) : this.#infoView.defaultTitle;
    this.#title =  this.#isBetweenZeroAndFour(points.length) ? this.#getTitleIsDash(points) : title;
    this.#dates = points.length > 0 ? this.#getDates(points) : this.#infoView.defaultDates;
  };

  #isGreaterThenThree = (length) => length > TRIP_FROM_THREE_POINTS_COUNT;

  #isBetweenZeroAndFour = (length) => length > 0 && length <= TRIP_FROM_THREE_POINTS_COUNT;

  #getDates = (points) => `${getDayOf(points[0].dateFrom)} — ${getDayOf(points[points.length - 1].dateTo)}`;

  #getTitleIsThreeDot = (points) => `${points[0].destination.name} ... ${points[points.length - 1].destination.name}`;

  #getTitleIsDash = (points) => points.reduce((i, point) => `${i} — ${point.destination.name}`, '').slice(2);

  increaseTotalCost = (totalPrice) => {this.#totalCost += totalPrice;};

  reduceTotalCost = (totalPrice) => {this.#totalCost -= totalPrice;};

  renderInfoView = () => {
    render(this.#infoView, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };
}
