const dotenv = require('dotenv').config();
const express  = require('express');
const app = express();
const EJS = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const port = process.env.PORT;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");

// Database configuration
require('./src/config/databaseConfig');

// Template engine settings
app.use(expressLayout);
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '/src/uploads')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

const MongoDBStore = require('connect-mongodb-session')(session);
const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: process.env.SESSION_COLLECTION_NAME
})
// Session & Flash Message
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: sessionStore
}));

app.use(flash());
app.use((request, response, next) => {
    response.locals.validation_errors = request.flash('validation_errors');
    next();
})

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Routers includes
const authRouter = require('./src/routers/authRouter');
const adminRouter = require('./src/routers/adminRouter');

// Get and Read Form Values
app.use(express.urlencoded({
    extended: true
}));


// Welcome page route
app.get('/', async function (request, response, next) {

    await response.json({
        message: 'Hello!'
    });
});

app.use('/', authRouter);
app.use('/admin', adminRouter);


// Application starting and listening
app.listen(port, () => {
    console.log(`Sunucu, ${port} portundan dinleniyor...`);
});
