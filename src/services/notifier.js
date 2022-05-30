export default class Notifier {
  #events = new Map();

  add = (eventName, callback) => {
    this.#events.set(eventName, callback);
  };

  remove = (eventName, callback) => {
    if (this.#events.has(eventName)) {
      this.#events.delete(eventName, callback);
    }
  };

  run = (eventName, args) => {
    const evt = this.#events.get(eventName);
    if (evt === undefined) {
      throw new Error(`${eventName} - event not found`);
    }
    evt.apply(null, args);
  };
}
