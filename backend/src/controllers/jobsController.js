const jobModel = require('../models/jobModel');

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await jobModel.findAllByUser(req.userId);
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobModel.findById(req.params.id, req.userId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await jobModel.create({ user_id: req.userId, ...req.body });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobModel.update(req.params.id, req.userId, req.body);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await jobModel.remove(req.params.id, req.userId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };