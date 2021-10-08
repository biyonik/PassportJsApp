const dotenv = require('dotenv').config();
const express  = require('express');
const app = express();
const EJS = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const port = process.env.PORT;

// Database configuration
require('./src/config/databaseConfig');

// Template engine settings
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src'));

// Welcome page route
app.get('/', async function (request, response, next) {

});

// Application starting and listening
app.listen(port, () => {
    console.log(`Sunucu, ${port} portundan dinleniyor...`);
});
