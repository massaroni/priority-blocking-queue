var chai = require('chai');
var expect = chai.expect;

const PriorityBlockingQueue = require('../src/priority-blocking-queue');
const PriorityQueue = require('priorityqueue');

describe('Priority Blocking Queue', function () {

  it('should take the highest priority item first', async function () {
    let queue = new PriorityBlockingQueue((lhs, rhs) => lhs.p - rhs.p);
    queue.put({p:2}).put({p:3}, {p:1});
    expect(queue.size()).to.equal(3);

    let head = await queue.take();
    expect(head.p).to.equal(3);
    expect(queue.takersBlocked()).to.equal(0);
  });

  it('should block takers until an item is available', async function () {
    let queue = new PriorityBlockingQueue((lhs, rhs) => lhs.p - rhs.p);
    let takerPromises = [];
    takerPromises.push(queue.take().then((item) => {
      expect(item.p).to.equal(3);
    }));
    takerPromises.push(queue.take().then((item) => {
      expect(item.p).to.equal(2);
    }));

    expect(queue.takersBlocked()).to.equal(2);
    expect(queue.size()).to.equal(0);
    
    setTimeout(function () {
      expect(queue.takersBlocked()).to.equal(2);
      queue.put({p:2}, {p:3}, {p:1});
      expect(queue.takersBlocked()).to.equal(2);
      expect(queue.size()).to.equal(3);
    });

    return Promise.all(takerPromises);
  });

  it('should get sorted items back from the priority queue', async function () {
    let queue = new PriorityQueue({comparator: (lhs, rhs) => lhs.p - rhs.p});
    queue.push({p:2});
    queue.push({p:3});
    queue.push({p:1});
    expect(queue.size()).to.equal(3);
    expect(queue.pop().p).to.equal(3);
    expect(queue.pop().p).to.equal(2);
    expect(queue.pop().p).to.equal(1);
  });


});
