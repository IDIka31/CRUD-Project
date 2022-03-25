const mongoose = require('mongoose');

const config = require('../config/config');

const connectToDB = () => {
    return new Promise((res, rej) => {
        mongoose.connect(config.mongoDBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.on('connected', () => {
            return res('Mongoose connected to MongoDB');
        });
        mongoose.connection.on('error', (err) => {
            return rej(new Error(`Mongoose connection error: ${err}`));
        });
    });
};

module.exports = {
    connectToDB
}