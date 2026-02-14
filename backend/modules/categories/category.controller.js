const service = require("./category.service");

exports.createCategory = async (req, res, next) => {
  try {
    const category = await service.createCategory(req.user.userId, req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await service.getCategories(req.user.userId);
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const updated = await service.updateCategory(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await service.deleteCategory(req.user.userId, req.params.id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
