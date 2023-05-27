require('dotenv').config();  
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.mongo).then(() => {
  console.log('conneced');
}).catch((err) => {
  console.log(err.message);
})
const express = require('express');
const app = express();
const path = require('path');
const hbs = require("express-handlebars");
const helpers = require("./middleware/helpers") 
const hb = hbs.create({})
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layout/",
  partialsDir: __dirname + "/partials/",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,   
  },

  helpers: helpers
}));
const confic = require('./confic/userConfic')
const session = require("express-session");
app.use(
  session({
    secret: confic.sessionsecret,
    saveUninitialized: true,
    cookie: { maxage: 60000 },
    resave: false,
  })
);
hb.handlebars.registerHelper('eq', function (a, b) {
  return a == b;
})



const route = require("./routes/user-routes");
app.use('/', route);

const adminroute = require('./routes/admin-routes');
app.use('/admin', adminroute);




app.get('*', function (req, res) {
  try {
    res.render('user/404');
  } catch (error) {
    console.log("error in 404 ", error.message);
  }
})


app.listen(3000, () => {
  console.log("server is running");
})
module.exports = app;
