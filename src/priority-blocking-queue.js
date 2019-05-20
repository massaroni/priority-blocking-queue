const PriorityQueue = require('priorityqueue');

class PriorityBlockingQueue {

  /**
   * @param {*} comparator - function comparing two items for the priority queue
   * @param {*} options - more options for the priority queue
   */
  constructor(comparator, options = {}) {
    options.comparator = comparator;
    this.items = new PriorityQueue(options);
    this.takers = [];

    const items = this.items;
    const takers = this.takers;

    this._giveAllSync = function () {
      while (takers.length > 0 && items.size() > 0) {
        takers.shift()(items.pop());
      }
    };
  }

  /**
   * Waits for a head item of a priority queue and removes it.
   * If the queue is empty, it blocks and waits for an item to become available.
   */
  async take() {
    const takers = this.takers;
    const promise = new Promise((resolve) => {
      takers.push(resolve);
    });
    this._giveAll();
    return promise;
  }

  /**
   * Inserts the specified item into a priority queue.
   */
  put(...items) {
    for (let item of items) {
      if (!!item) {
        this.items.push(item);
        this._giveAll();
      }
    }
    return this;
  }

  _giveAll() {
    setTimeout(this._giveAllSync);
  }

  size() {
    return this.items.size();
  }

  takersBlocked() {
    return this.takers.length;
  }
}

module.exports = PriorityBlockingQueue;