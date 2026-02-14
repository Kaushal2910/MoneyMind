const service = require("./budget.service");

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await service.createBudget(
      req.user.userId,
      req.body
    );
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await service.getBudgets(
      req.user.userId,
      req.query
    );
    res.json({ success: true, count: budgets.length, data: budgets });
  } catch (err) {
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const updated = await service.updateBudget(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await service.deleteBudget(
      req.user.userId,
      req.params.id
    );
    res.json({ success: true, message: "Budget deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getBudgetStatus = async (req, res, next) => {
  try {
    const { month } = req.query;
    const status = await service.getBudgetStatus(
      req.user.userId,
      month
    );
    res.json({ success: true, month, data: status });
  } catch (err) {
    next(err);
  }
};
