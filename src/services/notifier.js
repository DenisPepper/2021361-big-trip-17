class EventPool {
  #events = new Set();
  add = (event) => this.#events.add(event);
  remove = (event) => this.#events.remove(event);
  invoke = (args) => this.#events.forEach((event) => event(args));
}

export default class EventManager {
  #events = new Map();

  /**
   * Метод возвращает новый пул функций обратного вызова
   * @param {String} name - ключ для нового пула функций
   * @returns {Map<String, EventPool>} элемент карты событий
   */
  #createEventPool = (name) => {
    const pool = new EventPool();
    this.#events.set(name, pool);
    return pool;
  };

  /**
   * Метод возвращает готовый или новый пул функций обратного вызова
   * @param {String} name - ключ для нового пула функций
   * @returns {Map<String, EventPool>}
   */
  #getNotifier = (name) => {
    const pool = this.#events.get(name);
    if (pool) {
      return pool;
    }
    return this.#createEventPool(name);
  };

  /**
   * Метод добавляет функцию в пул функций обратного вызова
   * @param {String} name - ключ пула функций
   * @param {Function} event - функция обратного вызова
   */
  add = (name, event) => {
    this.#getNotifier(name).add(event);
  };

  /**
   * Метод удаляет функцию из пула функций обратного вызова
   * @param {String} name - ключ пула функций
   * @param {Function} event - функция обратного вызова
   */
  remove = (name, event) => {
    this.#getNotifier(name).remove(event);
  };

  /**
   * Метод вызывает все функции из пула функций обратного вызова
   * @param {String} name - ключ пула функций
   * @param {Any} sourse - аргумент для функциий обратного вызова
   */
  invoke = (name, args) => {
    this.#getNotifier(name).invoke(args);
  };
}
