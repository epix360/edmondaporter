if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { storeReturnTo } = require('./middleware');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });
const { isLoggedIn } = require('./middleware');
const { cloudinary } = require('./cloudinary');

const Profile = require('./models/profile');
const Home = require('./models/home');

const MongoStore = require('connect-mongo');

// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/edmondaporter'

mongoose.connect(dbUrl);

const aboutRoutes = require('./routes/about');
const blogRoutes = require('./routes/blog');
const publicationRoutes = require('./routes/publications');
const linkRoutes = require('./routes/links');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const contactRoutes = require('./routes/contact');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('models', path.join(__dirname, '/models'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'trombonesandwichpartychimney!';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
  crypto: {
    secret: 'trombonesandwichpartychimney'
  }
});

store.on("error", function (e) {
  console.log("Session store error")
})

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  'https://unpkg.com',
  'https://cdn.quilljs.com',
  'https://cdn.jsdelivr.net/'
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net/',
  'https://unpkg.com',
  'https://cdn.quilljs.com',
  'https://fonts.gstatic.com',
  'https://fonts.googleapis.com/'
];
const connectSrcUrls = [
  "https://api.cloudinary.com/",
  "https://api.emailjs.com/"
];
const fontSrcUrls = [
  'https://fonts.gstatic.com',
  'https://fonts.googleapis.com/',
  'https://cdn.jsdelivr.net'
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'",
        ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'",
        "'self'",
        ...scriptSrcUrls],
      styleSrc: ["'self'",
        "'unsafe-inline'",
        ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Profile.authenticate()));

passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

//ROUTES
app.use('/about', aboutRoutes);
app.use('/blog', blogRoutes);
app.use('/publications', publicationRoutes);
app.use('/links', linkRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/contact', contactRoutes);

app.get('/', catchAsync(async (req, res) => {
  const { id } = req.params;
  const home = await Home.findById(id);
  const homes = await Home.find({});
  const profile = await Profile.findOne({});
  res.render('index', { profile, home, homes, currentPage: 'home' })
}))

app.get('/new', isLoggedIn, catchAsync(async (req, res) => {
  res.render('new', { currentPage: 'home' })
}))

app.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const home = await Home.findById(id);
  res.render('show', { home, currentPage: 'home' })
}))

app.post('/', upload.single('image'), isLoggedIn, catchAsync(async (req, res) => {
  const profile = await Profile.findOne({ id: { $eq: req.params._id } });
  const publicId = req.body.home.imageIds;
  const idArr = publicId.split(',');
  const imageId = idArr;
  const home = new Home(req.body.home);
  home.image = req.file.path;
  home.filename = req.file.filename;
  home.imageIds = imageId;
  profile.homes.push(home);
  home.profile = profile;
  const imageIdsToDelete = req.body.home.imageIdsToDelete;
  const idsToDelete = imageIdsToDelete.split(',');
  await cloudinary.api
    .delete_resources(idsToDelete,
      { type: 'upload', resource_type: 'image', invalidate: true })
    .then(console.log);
  await profile.save();
  await home.save();
  req.flash('success', 'Successfully created new home page content!');
  res.redirect('/')
}))

app.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const home = await Home.findOne({ id: { $eq: req.params._id } })
  if (!home) {
    req.flash('error', 'Cannot find that page!');
    return res.redirect('/');
  }
  res.render('edit', { home, currentPage: 'home' })
}))

app.put('/', isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
  const home = await Home.findOneAndUpdate({ id: { $eq: req.params._id } }, { ...req.body }, { runValidators: true, new: true });

  if (req.file) {
    home.image = req.file.path;
    home.filename = req.file.filename
  }

  const imageIdsToDelete = req.body.home.imageIdsToDelete;
  const idsToDelete = imageIdsToDelete.split(',');
  await cloudinary.api
    .delete_resources(idsToDelete,
      { type: 'upload', resource_type: 'image', invalidate: true })
    .then(console.log);
  await home.save();
  req.flash('success', 'Successfully updated blog post!');
  res.redirect('/')
}))

app.use(function (req, res, next) {
  res.status(404).render('page-not-found', { title: "Sorry, page not found" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})