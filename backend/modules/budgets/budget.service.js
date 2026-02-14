const repository = require("./budget.repository");

const validateAmount = (amount) => {
  if (typeof amount !== "number" || amount <= 0) {
    const err = new Error("Budget amount must be greater than 0");
    err.status = 400;
    throw err;
  }
};

const validateMonth = (month) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    const err = new Error("Invalid month format. Use YYYY-MM");
    err.status = 400;
    throw err;
  }
};

exports.createBudget = async (userId, data) => {
  const { category_id, amount, month } = data;

  if (!category_id || !month) {
    const err = new Error("category_id and month are required");
    err.status = 400;
    throw err;
  }

  validateAmount(amount);
  validateMonth(month);

  const category = await repository.validateCategoryOwnership(
    userId,
    category_id
  );

  if (!category) {
    const err = new Error("Invalid category");
    err.status = 400;
    throw err;
  }

  return repository.upsertBudget(userId, category_id, month, amount);
};



exports.getBudgets = async (userId, query) => {
  const { month } = query;

  if (month) validateMonth(month);

  return repository.getBudgets(userId, month);
};

exports.updateBudget = async (userId, id, data) => {
  const { amount } = data;

  validateAmount(amount);

  const updated = await repository.updateBudget(userId, id, amount);
  if (!updated) {
    const err = new Error("Budget not found");
    err.status = 404;
    throw err;
  }

  return updated;
};

exports.deleteBudget = async (userId, id) => {
  const deleted = await repository.deleteBudget(userId, id);
  if (!deleted) {
    const err = new Error("Budget not found");
    err.status = 404;
    throw err;
  }
};

exports.getBudgetStatus = async (userId, month) => {
  validateMonth(month);

  const rows = await repository.getBudgetStatus(userId, month);

  let totalIncomeBudget = 0;
  let totalIncomeActual = 0;
  let totalExpenseBudget = 0;
  let totalExpenseActual = 0;

  const categories = rows.map((row) => {
    const budget = Number(row.budget_amount);
    const actual = Number(row.actual_spent);

    const remaining = budget - actual;
    const usage =
      budget > 0 ? Number(((actual / budget) * 100).toFixed(2)) : 0;

    // IMPORTANT: assume repository also returns category_type
    if (row.category_type === "income") {
      totalIncomeBudget += budget;
      totalIncomeActual += actual;
    } else {
      totalExpenseBudget += budget;
      totalExpenseActual += actual;
    }

    return {
      category_id: row.category_id,
      category_name: row.category_name,
      category_type: row.category_type,
      budget_amount: budget,
      actual_spent: actual,
      remaining_amount: remaining,
      usage_percentage: usage,
    };
  });

  return {
    income: {
      total_budget: totalIncomeBudget,
      total_actual: totalIncomeActual,
      remaining: totalIncomeActual - totalIncomeBudget
    },
    expenses: {
      total_budget: totalExpenseBudget,
      total_actual: totalExpenseActual,
      remaining: totalExpenseBudget - totalExpenseActual
    },
    categories
  };
};
