const express = require('express');
const passport = require('passport');
const { InboxMessage, Mixtape, User } = require('../models');
const generateTestData = require('../testing/generateTestData');

const router = express.Router();

// TODO: secure this route
router.post('/insertTestData', async (req, res) => {
    const { inboxMessages, mixtapes, users } = await generateTestData();
    await Promise.all([users.map(user => User.register({ username: user.username, email: user.email }, user.password)), InboxMessage.insertMany(inboxMessages), Mixtape.insertMany(mixtapes)]);
    
    res.json({
        inboxMessages,
        mixtapes,
        users,
    });
});


module.exports = router;
