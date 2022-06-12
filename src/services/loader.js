const SEREVR_URL = 'https://17.ecmascript.pages.academy/big-trip';
const DEST_URN = '/destinations';
const OFFERS_URN = '/offers';
const POINTS_URN = '/points';
const Method = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' };

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

  #getApiUri = (name) => `${this.#serverURL}${name}`;

  #getParams = (method = Method.GET, contentType=undefined, body = undefined)=>({
    method,
    headers:{
      Authorization: 'Basic hS2sfS4tfvytfcl1sa2j',
      'Content-Type': contentType
    },
    body
  });

  #isJSON = (response) => {
    const contentType = response.headers.get('Content-Type');
    return contentType && contentType.indexOf('application/json') !== -1;
  };

  #sendRequest = async (uri, params) => {
    const result = { ok: false, data: [] };
    try {
      const response = await fetch(uri, params);
      if (response.ok) {
        const data = this.#isJSON(response) ? await response.json() : await response.text();
        return { ok: response.ok, data };
      } else {
        return result;
      }
    } catch (error) {
      return result;
    }
  };

  getPoints = async (loadPointsHandler) => {
    const uri = this.#getApiUri(this.#pointsURN);
    const params = this.#getParams();
    const response = await this.#sendRequest(uri, params);
    loadPointsHandler(response);
  };

  getDestinations = async (loadDestinationsHandler) => {
    const uri = this.#getApiUri(this.#destinationsURN);
    const params = this.#getParams();
    const response = await this.#sendRequest(uri, params);
    loadDestinationsHandler(response);
  };

  getOffers = async (loadOffersHandler) => {
    const uri = this.#getApiUri(this.#offersURN);
    const params = this.#getParams();
    const response = await this.#sendRequest(uri, params);
    loadOffersHandler(response);
  };

  createPoint = async (point, createPointHandler, args) => {
    const uri = this.#getApiUri(this.#pointsURN);
    const params = this.#getParams(Method.POST, 'application/json;charset=utf-8', JSON.stringify(point));
    const response = await this.#sendRequest(uri, params);
    createPointHandler(response, args);
  };

  updatePoint = async (point, updatePointHandler, args) => {
    const uri = this.#getApiUri(`${this.#pointsURN}/${point.id}`);
    const params = this.#getParams(Method.PUT, 'application/json;charset=utf-8', JSON.stringify(point));
    const response = await this.#sendRequest(uri, params);
    updatePointHandler(response, args);
  };

  deletePoint = async (point, deletePointHandler, args) => {
    const uri = this.#getApiUri(`${this.#pointsURN}/${point.id}`);
    const params = this.#getParams(Method.DELETE);
    const response = await this.#sendRequest(uri, params);
    response.point = point;
    deletePointHandler(response, args);
  };
}
