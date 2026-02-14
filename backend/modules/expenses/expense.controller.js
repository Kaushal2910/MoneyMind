const service = require("./expense.service");

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await service.createExpense(req.user.userId, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await service.getExpenses(req.user.userId, req.query);
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await service.getExpenseById(
      req.user.userId,
      req.params.id
    );
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const updated = await service.updateExpense(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    await service.deleteExpense(req.user.userId, req.params.id);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    next(err);
  }
};
