const service = require('./recurring.service');

exports.createRecurring = async (req, res, next) => {
  try {
    const data = await service.create(req.user.userId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getAllRecurring = async (req, res, next) => {
  try {
    const data = await service.getAll(req.user.userId, req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getRecurringById = async (req, res, next) => {
  try {
    const data = await service.getById(req.user.userId, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.updateRecurring = async (req, res, next) => {
  try {
    const data = await service.update(req.user.userId, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.deleteRecurring = async (req, res, next) => {
  try {
    await service.remove(req.user.userId, req.params.id);
    res.status(200).json({ success: true });
  } catch (err) { next(err); }
};

exports.toggleRecurring = async (req, res, next) => {
  try {
    const data = await service.toggle(req.user.userId, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
