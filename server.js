const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000; //Process = the machine running node
//env is the same as env on cmd shell, all the system variables.
//in this case we're setting the port to either the dynamic one OR 3000


var app = express();

hbs.registerPartials(__dirname + '/views/partials'); /*Partials are a way to store
frequently used html snippets as variables that we can reference in .hbs files */
app.set('view engine', 'hbs'); /*Let express know that we are going to be using
Handlebars as our view engine */

/*
    MIDDLEWARE IS EXECUTED IN THE ORDER IT IS WRITTEN.
    HENCE THE STATIC PUBLIC DIRECTORY IS DECLARED BELOW THE MAINENANCE MIDDLEWARE.
    THIS IS SO, IF THE SITE IS UNDER MAINTENANCE, THE PUBLIC DIRECTORY WON'T BE ACTIVE
    BECAUSE IT IS BELOW MAINTENANCE, WHICH NEVER COMPLETES.
*/

app.use((req, res, next) => { /*This is also middleware. It is a function that is called
    before anything below it happens. It takes the request, response and next parameters.
    The first two allow it to see the request data on that port. The response, as seen
    below, allows it to interact with the page. And next is a conditional function 
    which indicates when to move onto the code beneath, creating syncronisation */
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`; //method means GET/POST. Url is the path
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append log to file');
        }
    });
    next();
});

// app.use((req, res, next) => { /*This is also middleware, it literally happens in the "middle"
// of rendering views. In this case, we're using it to block the rest of the code below
// from happening, by not using next()*/
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public')); /*Use this middleware
to teach express how to read from a static directory */

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear(); /*Helpers are a way to store functions that can
    be called in .hbs files, in the same way as we reference properties passed into the
    render function i.e: {{myhelper}}. If a function has arguments, call them with
    {{myhelper myarguments}} */
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'This is the home page of my amazing website, enjoy!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects page'
    });
});

app.get('/bad', (req, res) => {
    res.send(404, {
        error: 'Sorry, can\'t find that'
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});