const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { User } = require('./models');

const userRoute = require('./routes/user');
const mixtapeRoute = require('./routes/mixtape');
const adminRoute = require('./routes/admin');
const youtubeRoute = require('./routes/youtube');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const app =  express();
app.set('trust proxy', 1) // trust first proxy
app.use(cors({ credentials: true, origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000' })); // TODO: figure out where/if this is actually needed. for now, apply to all routes.
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
    },
}));

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(passport.initialize());
app.use(passport.session());

app.use('/youtube', youtubeRoute);
app.use('/admin', adminRoute);
app.use('/mixtape', mixtapeRoute);
app.use('/user', userRoute);
app.get('/', async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
