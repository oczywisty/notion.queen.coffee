const queue = [];
let isProcessing = false;

function enqueue(item) {
  queue.push(item);
  if (!isProcessing) {
    processQueue();
  }
}

async function processQueue() {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = queue.shift();
  try {
    const result = await item.fn(...item.args);
    item.resolve(result);
  } catch (error) {
    item.reject(error);
  } finally {
    processQueue();
  }
}

function createQueuedFunction(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      enqueue({ fn, args, resolve, reject });
    });
}

module.exports = {
  createQueuedFunction,
};
