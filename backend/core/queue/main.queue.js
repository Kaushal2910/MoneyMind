const { Queue } = require('bullmq');
const redisConnection = require('./redis.connection');
const { QUEUE_NAME, DEFAULT_JOB_OPTIONS } = require('./queue.constants');

const mainQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

module.exports = mainQueue;
