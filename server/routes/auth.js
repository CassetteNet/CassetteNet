const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const { User } = require('../models');
const { sendVerificationEmail } = require('../email/email');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    // generate email verification token
    const token = crypto.randomBytes(64).toString('hex');

    User.register(new User({ username, email, token, verified: false, admin: userCount === 0 }), password, async (err, user) => {
        if (err) return res.status(500).send(err); // TODO: error handling
        if (process.env.NODE_ENV === 'production') { // only send email in production deployment (i.e. heroku)
            try {
                await sendVerificationEmail(email, token);
            } catch(err) {
                console.log(err); // TODO: error handling    
            }
        }
        let responsePayload;
        
        // send back full user object if running in development.
        // otherwise don't, due to security
        if (process.env.NODE_ENV === 'production') {
            responsePayload = 'signup successful';
        } else {
            responsePayload = user;
        }
        passport.authenticate('local')(req, res, () => res.send(responsePayload));
    });
});



router.post('/login', passport.authenticate('local'), async (req, res) => {
    const { username, uniqueId, _id, favoritedMixtapes, followedUsers, admin, createdAt, updatedAt, verified } = req.user;
    if (!verified) {
        return res.status(400).send('user not verified.');
    }
    const followedUsersDenormalized = [];
    for (const userId of followedUsers) {
        const user = await User.findById(userId);
        const followerCount = (await User.find({ followedUsers: user._id })).length;
        const createdAt = new Date(user.createdAt);
        const updatedAt = new Date(user.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: user.uniqueId,
            username: user.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount 
        });
    }
    const followers = (await User.find({ followedUsers: _id })).length;
    res.json({
        _id,
        favoritedMixtapes,
        followedUsers: followedUsersDenormalized,
        followers,
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
        admin,
        createdAt,
        updatedAt,
    });
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.send('logged out.');
});

router.put('/verify', async (req, res) => {
    const { token } = req.body;
    try {
        await User.updateOne({ token }, { verified: true });
        res.send('user verified');
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;
