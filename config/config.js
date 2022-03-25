// Require DotEnv
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    mongoDBURI: process.env.MONGO_DB_URI,
    sessionSecret: process.env.SESSION_SECRET,
};