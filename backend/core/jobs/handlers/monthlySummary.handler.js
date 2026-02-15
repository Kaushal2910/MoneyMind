const pool = require('../../../config/db'); // adjust path if needed

module.exports = async function monthlySummaryHandler(job) {
  const { user_id, month } = job.data;

  if (!user_id || !month) {
    throw new Error('Invalid job payload: user_id and month are required');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Calculate next month start
    const startDate = new Date(month);
    const nextMonthStart = new Date(startDate);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

    // Aggregate income and expense
    const aggregationQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN e.amount END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN c.type = 'expense' THEN e.amount END), 0) AS total_expense
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = $1
        AND e.expense_date >= $2
        AND e.expense_date < $3
    `;

    const result = await client.query(aggregationQuery, [
      user_id,
      startDate,
      nextMonthStart,
    ]);

    const total_income = Number(result.rows[0].total_income);
    const total_expense = Number(result.rows[0].total_expense);

    const total_savings = total_income - total_expense;

    const savings_rate =
      total_income > 0
        ? Number(((total_savings / total_income) * 100).toFixed(2))
        : 0;

    // UPSERT into monthly_summary
    const upsertQuery = `
      INSERT INTO monthly_summary
        (user_id, month, total_income, total_expense, total_savings, savings_rate, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, month)
      DO UPDATE SET
        total_income = EXCLUDED.total_income,
        total_expense = EXCLUDED.total_expense,
        total_savings = EXCLUDED.total_savings,
        savings_rate = EXCLUDED.savings_rate,
        created_at = NOW();
    `;

    await client.query(upsertQuery, [
      user_id,
      startDate,
      total_income,
      total_expense,
      total_savings,
      savings_rate,
    ]);

    await client.query('COMMIT');

    console.log(
      `Monthly summary updated for user ${user_id} month ${month}`
    );

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Monthly summary job failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
};
