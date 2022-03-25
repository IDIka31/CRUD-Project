const { Schema } = require('mongoose');
const validator = require('validator').default;

const accountSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'User email address required'],
        unique: true,
        validate: {
            validator: (v) => {
                validator.isEmail(v);
            },
            message: '{VALUE} is not a valid email',
        },
    },
});

module.exports = accountSchema;