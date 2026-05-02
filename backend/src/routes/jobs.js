const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const jobsController = require('../controllers/jobsController');
const validate = require('../middleware/validate');

router.get('/', jobsController.getAllJobs);
router.get('/:id', jobsController.getJobById);

router.post('/',
  [
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('status').optional().isIn(['saved', 'applied', 'interviewing', 'offer', 'rejected'])
      .withMessage('Invalid status value'),
    body('job_type').optional({ nullable: true }).isIn(['remote', 'hybrid', 'onsite'])
      .withMessage('Invalid job type'),
    body('salary_min').optional({ nullable: true }).isInt({ min: 0 })
      .withMessage('Salary min must be a positive number'),
    body('salary_max').optional({ nullable: true }).isInt({ min: 0 })
      .withMessage('Salary max must be a positive number'),
  ],
  validate,
  jobsController.createJob
);

router.put('/:id',
  [
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('status').optional().isIn(['saved', 'applied', 'interviewing', 'offer', 'rejected'])
      .withMessage('Invalid status value'),
    body('job_type').optional({ nullable: true }).isIn(['remote', 'hybrid', 'onsite'])
      .withMessage('Invalid job type'),
  ],
  validate,
  jobsController.updateJob
);

router.delete('/:id', jobsController.deleteJob);

module.exports = router;