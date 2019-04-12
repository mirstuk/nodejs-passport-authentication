require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');

const app = express();

//passport config
require('./config/passport')(passport);

const MongoDB = process.env.MLAB_URI;

mongoose
  .connect(MongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected ...'))
  .catch(err => console.log(err));

// helmet
app.use(helmet());

app.use('/public', express.static(path.join(__dirname, '/public')));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// globals flash vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on ${PORT}...`));
