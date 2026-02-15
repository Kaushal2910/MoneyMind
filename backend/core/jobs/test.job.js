require('dotenv').config();

const { mainQueue } = require('../queue');

async function addTestJob() {
  try {
    
    await mainQueue.add('monthly_summary_calculation', {
        user_id: "516631da-c874-4380-b789-93b2f77c86c5",
        month: '2026-02-01',
    });

    console.log(' new Test job added successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test job:', error.message);
    process.exit(1);
  }
}

addTestJob();
