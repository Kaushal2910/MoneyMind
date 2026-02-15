const expenseAddedHandler = require('./handlers/expenseAdded.handler');
const recurringDueCheckHandler = require('./handlers/recurringDueCheck.handler');
const budgetThresholdHandler = require('./handlers/budgetThreshold.handler');
const monthlySummaryHandler = require('./handlers/monthlySummary.handler');
const financialScoreHandler = require('./handlers/financialScore.handler');
const predictionHandler = require('./handlers/prediction.handler');

async function jobRouter(job) {
  switch (job.name) {
    case 'expense_added':
      return expenseAddedHandler(job);

    case 'recurring_due_check':
      return recurringDueCheckHandler(job);

    case 'budget_threshold_check':
      return budgetThresholdHandler(job);

    case 'monthly_summary_calculation':
      return monthlySummaryHandler(job);

    case 'financial_score_calculation':
      return financialScoreHandler(job);

    case 'prediction_calculation':
      return predictionHandler(job);

    default:
      throw new Error(`Unhandled job type: ${job.name}`);
  }
}

module.exports = jobRouter;
