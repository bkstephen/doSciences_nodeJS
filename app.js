const express = require('express');
const app = express();
const expresslayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Server started on port' + PORT));
app.use("/views/css", express.static(__dirname + "/views/css"));
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error(err));

//expressjs
app.use(expresslayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }))

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flas
app.use(flash());

//Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/index') )