const service = require('./notification.service');

exports.getNotifications = async (req, res, next) => {
  try {
    const data = await service.getAll(req.user.userId, req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const data = await service.markAsRead(req.user.userId, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data
    });
  } catch (err) { next(err); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const updatedCount = await service.markAllAsRead(req.user.userId);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: { updated_count: updatedCount }
    });
  } catch (err) { next(err); }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await service.delete(req.user.userId, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) { next(err); }
};
