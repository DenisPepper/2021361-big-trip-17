import { render } from '../framework/render';
import { RenderPosition } from '../settings';

export default class InfoPresenter {
  #infoView;
  #mainContainer;

  init = (infoView, mainContainer) => {
    this.#infoView = infoView;
    this.#mainContainer = mainContainer;
    return this;
  };

  renderInfoView = () => {
    render(this.#infoView, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };
}
