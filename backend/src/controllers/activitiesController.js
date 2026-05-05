const activityModel = require('../models/activityModel');

const getActivities = async (req, res, next) => {
  try {
    const activities = await activityModel.findAllByJob(req.params.jobId, req.userId);
    res.json({ activities });
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await activityModel.create({
      job_id: req.params.jobId,
      user_id: req.userId,
      ...req.body,
    });
    res.status(201).json({ activity });
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const activity = await activityModel.update(req.params.id, req.userId, req.body);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ activity });
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const activity = await activityModel.remove(req.params.id, req.userId);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivities, createActivity, updateActivity, deleteActivity };