const express = require('express');
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    User.register(new User({ username, email, verified: false, admin: userCount === 0 }), password, (err, user) => {
        if (err) res.send(err); // TODO: error handling

        passport.authenticate('local')(req, res, () => res.send(user));
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send();
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.redirect('/');
});

module.exports = router;
