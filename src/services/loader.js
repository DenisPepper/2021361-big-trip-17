const SEREVR_URL = 'https://17.ecmascript.pages.academy/big-trip';
const DEST_URI = '/destinations';
const OFFERS_URI = '/offers';
const POINTS_URI = '/points';
const Method = { GET: 'GET' };

export default class Loader {
  #serverURL = '';
  #pointsURN = '';
  #destinationsURN = '';
  #offersURN = '';

  constructor(
    serverURL = SEREVR_URL,
    pointsURN = POINTS_URI,
    destinationsURN = DEST_URI,
    offersURN = OFFERS_URI
  ) {
    this.#serverURL = serverURL;
    this.#destinationsURN = destinationsURN;
    this.#offersURN = offersURN;
    this.#pointsURN = pointsURN;
  }

  #sendRequest = async (url, params) => {
    const response = await fetch(url, params);
    if (response.ok) {
      const data = await response.json();
      return {ok: response.ok, data};
    } else {
      return {ok: false, data: []};
    }
  };

  getPoints = async (whenLoadPoints) => {
    const url = `${this.#serverURL}${this.#pointsURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const points = await this.#sendRequest(url, params);
    whenLoadPoints(points);
  };

  getDestinations = async (whenLoadDestinations) => {
    const url = `${this.#serverURL}${this.#destinationsURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const destinations = await this.#sendRequest(url, params);
    whenLoadDestinations(destinations);
  };

  getOffers = async (whenLoadOffers) => {
    const url = `${this.#serverURL}${this.#offersURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const offers = await this.#sendRequest(url, params);
    whenLoadOffers(offers);
  };
}
