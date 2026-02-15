require('dotenv').config();

const { Worker } = require('bullmq');
const redisConnection = require('../queue/redis.connection');
const { QUEUE_NAME } = require('../queue/queue.constants');
const jobRouter = require('../jobs/jobRouter');
const { concurrency } = require('./worker.config');
const registerWorkerEvents = require('./worker.events');

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    return jobRouter(job);
  },
  {
    connection: redisConnection,
    concurrency,
  }
);

registerWorkerEvents(worker);

console.log(`Worker started. Listening to queue: ${QUEUE_NAME}`);

module.exports = worker;
