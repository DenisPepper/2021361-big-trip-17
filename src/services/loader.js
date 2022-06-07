const SEREVR_URL = 'https://17.ecmascript.pages.academy/big-trip';
const DEST_URN = '/destinations';
const OFFERS_URN = '/offers';
const POINTS_URN = '/points';
const Method = { GET: 'GET', PUT: 'PUT' };

export default class Loader {
  #serverURL = '';
  #pointsURN = '';
  #destinationsURN = '';
  #offersURN = '';

  constructor(
    serverURL = SEREVR_URL,
    pointsURN = POINTS_URN,
    destinationsURN = DEST_URN,
    offersURN = OFFERS_URN
  ) {
    this.#serverURL = serverURL;
    this.#destinationsURN = destinationsURN;
    this.#offersURN = offersURN;
    this.#pointsURN = pointsURN;
  }

  #sendRequest = async (uri, params) => {
    const response = await fetch(uri, params);
    if (response.ok) {
      const data = await response.json();
      return { ok: response.ok, data };
    } else {
      return { ok: false, data: [] };
    }
  };

  getPoints = async (loadPointsHandler) => {
    const uri = `${this.#serverURL}${this.#pointsURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const response = await this.#sendRequest(uri, params);
    loadPointsHandler(response);
  };

  getDestinations = async (loadDestinationsHandler) => {
    const uri = `${this.#serverURL}${this.#destinationsURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const response = await this.#sendRequest(uri, params);
    loadDestinationsHandler(response);
  };

  getOffers = async (loadOffersHandler) => {
    const uri = `${this.#serverURL}${this.#offersURN}`;
    const params = {
      method: Method.GET,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
      },
    };
    const response = await this.#sendRequest(uri, params);
    loadOffersHandler(response);
  };

  updatePoint = async (point, updatePointHandler, args) => {
    const uri = `${this.#serverURL}${this.#pointsURN}/${point.id}`;
    const params = {
      method: Method.PUT,
      headers: {
        Authorization: 'Basic hS2sfS44wcl1sa2j',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(point)
    };
    const response = await this.#sendRequest(uri, params);
    updatePointHandler(response, args);
  };
}
