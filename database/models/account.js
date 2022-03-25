const { model } = require('mongoose');

const accountSchema = require('../schema/account');

module.exports = model('account', accountSchema);