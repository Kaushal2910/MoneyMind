module.exports = {
  concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
};
