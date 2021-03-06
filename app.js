require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const bcrypt        = require('bcrypt');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('./models/User');
const flash         = require('connect-flash');

mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'Faching',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 },
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  ttl: 24 * 60 * 60 // 1 day
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

// Login local strategy
passport.use('local-login', new LocalStrategy( { passReqToCallback: true }, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username!!!' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }

    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Confirm currentUser is logged in. 
app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  next();
});

// hbs helpers
hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
      throw new Error('Handlebars Helper ifUndefined needs 1 parameter');
  if (typeof value !== undefined ) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
});

hbs.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});

// default value for title local
app.locals.title = 'Faching';

//Routes
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user');
const birdRoutes = require('./routes/bird');

app.use('/', index);
app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/birds', birdRoutes);

module.exports = app;
