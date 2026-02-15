module.exports = {
  QUEUE_NAME: process.env.QUEUE_NAME || 'main-automation-queue',

  DEFAULT_JOB_OPTIONS: {
    attempts: Number(process.env.QUEUE_DEFAULT_ATTEMPTS) || 3,
    backoff: {
      type: 'exponential',
      delay: Number(process.env.QUEUE_BACKOFF_DELAY) || 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};
