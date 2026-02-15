function registerWorkerEvents(worker) {
  worker.on('completed', (job) => {
    console.log(`[Worker] Job completed: ${job.name} (ID: ${job.id})`);
  });

  worker.on('failed', (job, err) => {
    console.error(
      `[Worker] Job failed: ${job?.name} (ID: ${job?.id}) - ${err.message}`
    );
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err.message);
  });
}

module.exports = registerWorkerEvents;
