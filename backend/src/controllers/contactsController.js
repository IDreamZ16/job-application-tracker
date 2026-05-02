const contactModel = require('../models/contactModel');

const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactModel.findAllByJob(req.params.jobId, req.userId);
    res.json({ contacts });
  } catch (err) {
    next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await contactModel.create({
      job_id: req.params.jobId,
      user_id: req.userId,
      ...req.body,
    });
    res.status(201).json({ contact });
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await contactModel.update(req.params.id, req.userId, req.body);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ contact });
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactModel.remove(req.params.id, req.userId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };