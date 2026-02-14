const repository = require('./recurring.repository');

const VALID_FREQUENCIES = ['monthly', 'quarterly', 'yearly'];

function validateInput(data) {
  if (data.frequency && !VALID_FREQUENCIES.includes(data.frequency))
    throw new Error('Invalid frequency');

  if (data.amount !== undefined && Number(data.amount) <= 0)
    throw new Error('Amount must be greater than 0');

  if (data.start_date && data.next_due_date) {
    if (new Date(data.next_due_date) < new Date(data.start_date))
      throw new Error('next_due_date must be >= start_date');
  }

  if (data.end_date && data.start_date) {
    if (new Date(data.end_date) < new Date(data.start_date))
      throw new Error('end_date must be >= start_date');
  }
}

function calculateNextDueDate(currentDate, frequency) {
  const date = new Date(currentDate);

  if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  if (frequency === 'quarterly') date.setMonth(date.getMonth() + 3);
  if (frequency === 'yearly') date.setFullYear(date.getFullYear() + 1);

  return date.toISOString().split('T')[0];
}

exports.create = async (userId, payload) => {
  validateInput(payload);

  await repository.verifyCategoryOwnership(userId, payload.category_id);

  return repository.create(userId, payload);
};

exports.getAll = async (userId, query) => {
  return repository.findAll(userId, query);
};

exports.getById = async (userId, id) => {
  const record = await repository.findById(userId, id);
  if (!record) throw new Error('Recurring payment not found');
  return record;
};

exports.update = async (userId, id, payload) => {
  validateInput(payload);

  const existing = await repository.findById(userId, id);
  if (!existing) throw new Error('Recurring payment not found');

  if (payload.category_id)
    await repository.verifyCategoryOwnership(userId, payload.category_id);

  return repository.update(userId, id, payload);
};

exports.remove = async (userId, id) => {
  const existing = await repository.findById(userId, id);
  if (!existing) throw new Error('Recurring payment not found');

  await repository.remove(userId, id);
};

exports.toggle = async (userId, id) => {
  const record = await repository.findById(userId, id);
  if (!record) throw new Error('Recurring payment not found');

  const updated = await repository.toggle(userId, id);

  if (updated.is_active && new Date(updated.next_due_date) < new Date()) {
    const next = calculateNextDueDate(
      updated.next_due_date,
      updated.frequency
    );
    return repository.update(userId, id, { next_due_date: next });
  }

  return updated;
};
