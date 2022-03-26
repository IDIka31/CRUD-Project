const express = require('express');
const { body, check, validationResult } = require('express-validator');

const accountModel = require('../database/models/account');

const app = express.Router();

app.get('/', async (req, res) => {
    const account = await accountModel.find();

    return res.render('index', {
        layout: 'layouts/main-layout',
        title: 'Account List',
        success: req.flash('success'),
        error: req.flash('error'),
        account,
    });
});

app.post(
    '/',
    [
        body('username').custom(async (value) => {
            if (value === '') {
                throw new Error('Username cannot be empty!');
            }
            const account = await accountModel.findOne({ username: value });
            if (account) {
                throw new Error('Username already exists!');
            }

            return true;
        }),
        body('email').custom(async (value) => {
            if (value === '') {
                throw new Error('Username cannot be empty!');
            }
            const account = await accountModel.findOne({ email: value });
            if (account) {
                throw new Error('Email already exists!');
            }

            return true;
        }),
        check('email', 'Invalid email address!').isEmail(),
    ],
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            req.flash('error', error.array());
            res.redirect('/create');
        } else {
            await accountModel.create(req.body);
            req.flash('success', 'Account created successfully!');
            res.redirect('/');
        }
    }
);

app.delete('/', (req, res) => {
    accountModel
        .findOne({ _id: req.params._id })
        .then(async () => {
            await accountModel.deleteOne({ _id: req.body._id });
            req.flash('success', 'Account deleted successfully!');
            res.redirect('/');
        })
        .catch(() => {
            req.flash('error', 'Account not found!');
            res.redirect('/');
        });
});

app.put(
    '/',
    [
        body('username').custom(async (value, { req }) => {
            if (value === '') {
                throw new Error('Username cannot be empty!');
            }

            const account = await accountModel.findOne({ username: value });

            if (value !== req.body.oldUsername && account) {
                throw new Error('Username already exists!');
            }

            return true;
        }),
        body('email').custom(async (value, { req }) => {
            if (value === '') {
                throw new Error('Email cannot be empty!');
            }
            const account = await accountModel.findOne({ email: value });
            if (value !== req.body.oldEmail && account) {
                throw new Error('Email already exists!');
            }

            return true;
        }),
        check('email', 'Invalid email address!').isEmail(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            req.flash('error', error.array());
            res.redirect(`/edit/${encodeURIComponent(req.body._id)}`);
        } else {
            await accountModel.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        username: req.body.username,
                        email: req.body.email,
                    },
                }
            );

            req.flash('success', 'Account updated successfully!');
            res.redirect('/');
        }
    }
);

app.get('/edit/:_id', (req, res) => {
    accountModel
        .findOne({ _id: req.params._id })
        .then(() => {
            return res.render('update', {
                layout: 'layouts/main-layout',
                title: 'Update Account',
                success: req.flash('success'),
                error: req.flash('error'),
                account,
            });
        })
        .catch(() => {
            req.flash('error', 'Account not found!');
            res.redirect('/');
        });
});

app.get('/create', (req, res) => {
    return res.render('create', {
        layout: 'layouts/main-layout',
        title: 'Create Account',
        error: req.flash('error'),
    });
});

module.exports = app;
