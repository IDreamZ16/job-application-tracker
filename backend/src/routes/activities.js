const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const activitiesController = require('../controllers/activitiesController');
const validate = require('../middleware/validate');

router.get('/', activitiesController.getActivities);

router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['applied', 'email', 'phone_screen', 'interview', 'offer', 'rejected', 'note'])
      .withMessage('Invalid activity type'),
    body('activity_date').optional().isISO8601().withMessage('Valid date is required'),
  ],
  validate,
  activitiesController.createActivity
);

router.put('/:id',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['applied', 'email', 'phone_screen', 'interview', 'offer', 'rejected', 'note'])
      .withMessage('Invalid activity type'),
    body('activity_date').optional().isISO8601().withMessage('Valid date is required'),
  ],
  validate,
  activitiesController.updateActivity
);

router.delete('/:id', activitiesController.deleteActivity);

module.exports = router;