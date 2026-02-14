const repository = require("./expense.repository");

const validateAmount = (amount) => {
  if (typeof amount !== "number" || amount <= 0) {
    const err = new Error("Amount must be greater than 0");
    err.status = 400;
    throw err;
  }
};

const validateMonthFormat = (month) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    const err = new Error("Invalid month format. Use YYYY-MM");
    err.status = 400;
    throw err;
  }
};

exports.createExpense = async (userId, data) => {
  const { category_id, amount, description, expense_date, payment_method } = data;

  if (!category_id || !expense_date) {
    const err = new Error("category_id and expense_date are required");
    err.status = 400;
    throw err;
  }

  validateAmount(amount);
  //console.log("JWT user:", userId);
  //console.log("Category being checked:", category_id);

  const category = await repository.getCategoryById(category_id, userId);
  if (!category) {
    const err = new Error("Invalid category");
    err.status = 400;
    throw err;
  }

  return repository.createExpense(userId, data);
};

exports.getExpenses = async (userId, query) => {
  const { month, category_id } = query;

  if (month) validateMonthFormat(month);

  return repository.getExpenses(userId, {
    month,
    category_id,
  });
};

exports.getExpenseById = async (userId, id) => {
  const expense = await repository.getExpenseById(userId, id);
  if (!expense) {
    const err = new Error("Expense not found");
    err.status = 404;
    throw err;
  }
  return expense;
};

exports.updateExpense = async (userId, id, data) => {
  const existing = await repository.getExpenseById(userId, id);
  if (!existing) {
    const err = new Error("Expense not found");
    err.status = 404;
    throw err;
  }

  if (data.amount !== undefined) validateAmount(data.amount);

  if (data.category_id) {
    const category = await repository.getCategoryById(data.category_id, userId);
    if (!category) {
      const err = new Error("Invalid category");
      err.status = 400;
      throw err;
    }
  }

  return repository.updateExpense(userId, id, data);
};

exports.deleteExpense = async (userId, id) => {
  const deleted = await repository.deleteExpense(userId, id);
  if (!deleted) {
    const err = new Error("Expense not found");
    err.status = 404;
    throw err;
  }
};
