const repository = require('./notification.repository');

exports.getAll = async (userId, query) => {
  const { unread, page = 1, limit = 10 } = query;

  const parsedLimit = Math.min(Number(limit), 100);
  const parsedPage = Math.max(Number(page), 1);

  return repository.findAll(userId, {
    unread: unread === 'true',
    page: parsedPage,
    limit: parsedLimit
  });
};

exports.markAsRead = async (userId, id) => {
  const existing = await repository.findById(userId, id);
  if (!existing) throw new Error('Notification not found');

  if (existing.is_read) {
    return { id: existing.id, is_read: true };
  }

  const updated = await repository.markAsRead(userId, id);
  return { id: updated.id, is_read: updated.is_read };
};

exports.markAllAsRead = async (userId) => {
  return repository.markAllAsRead(userId);
};

exports.delete = async (userId, id) => {
  const existing = await repository.findById(userId, id);
  if (!existing) throw new Error('Notification not found');

  await repository.delete(userId, id);
};
