export default class Notifier {
  #events = new Set();
  add = (callback) => this.#events.add(callback);
  remove = (callback) => this.#events.delete(callback);
  run = () => this.#events.forEach((callback) => callback());
}
