const bcrypt = require('bcryptjs');
const { bcryptRounds } = require('../config/auth');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, bcryptRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };