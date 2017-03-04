let express         = require('express'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    logger          = require('morgan'),
    // cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport')
    LocalStrategy   = require('passport-local'),
    UserModel       = require('./models/user'),
    mongoose        = require('mongoose'),
    session         = require('express-session')

    // require route
    user            = require('./routes/user'),
    auth            = require('./routes/auth'),
    topic           = require('./routes/topic'),
    topics          = require('./routes/topics'),

    app             = express()

mongoose.connect('mongodb://127.0.0.1:27017/webtopic')

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(session({
    secret: 'secretkeywebtopic',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', auth)
app.use('/user', user)
app.use('/topic/api', topic)
app.use('/topics', topics)

app.use(function(req, res) {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}
//
//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

module.exports = app
