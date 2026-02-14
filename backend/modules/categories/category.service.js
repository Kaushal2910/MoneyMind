const repository = require("./category.repository");

const validateType = (type) => {
  if (!["expense", "income"].includes(type)) {
    const err = new Error("Invalid category type");
    err.status = 400;
    throw err;
  }
};

const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    const err = new Error("Category name must be at least 2 characters");
    err.status = 400;
    throw err;
  }
};

exports.createCategory = async (userId, data) => {
  const { name, type } = data;

  validateName(name);
  validateType(type);

  const trimmedName = name.trim();

  const existing = await repository.findByName(userId, trimmedName);
  if (existing) {
    const err = new Error("Category name already exists");
    err.status = 400;
    throw err;
  }

  return repository.createCategory(userId, {
    name: trimmedName,
    type,
  });
};

exports.getCategories = async (userId) => {
  return repository.getAll(userId);
};

exports.updateCategory = async (userId, id, data) => {
  const { name } = data;

  validateName(name);

  const trimmedName = name.trim();

  const duplicate = await repository.findByName(userId, trimmedName);
  if (duplicate && duplicate.id !== id) {
    const err = new Error("Category name already exists");
    err.status = 400;
    throw err;
  }

  const updated = await repository.updateName(userId, id, trimmedName);
  if (!updated) {
    const err = new Error("Category not found or cannot modify default category");
    err.status = 404;
    throw err;
  }

  return updated;
};

exports.deleteCategory = async (userId, id) => {
  const deleted = await repository.deleteCategory(userId, id);
  if (!deleted) {
    const err = new Error("Category not found or cannot delete default category");
    err.status = 404;
    throw err;
  }
};
