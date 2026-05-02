const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const contactsController = require('../controllers/contactsController');
const validate = require('../middleware/validate');

router.get('/', contactsController.getContacts);

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Contact name is required'),
    body('email').optional({ nullable: true }).isEmail().withMessage('Valid email is required'),
    body('phone').optional({ nullable: true }),
    body('linkedin_url').optional({ nullable: true }).isURL().withMessage('Valid URL is required'),
  ],
  validate,
  contactsController.createContact
);

router.put('/:id',
  [
    body('name').trim().notEmpty().withMessage('Contact name is required'),
    body('email').optional({ nullable: true }).isEmail().withMessage('Valid email is required'),
  ],
  validate,
  contactsController.updateContact
);

router.delete('/:id', contactsController.deleteContact);

module.exports = router;