const express = require("express");
const path = require('path')
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config({path: './.env'})

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname,'./public')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine','hbs')

app.use(express.static(publicDirectory));

app.use(cookieParser());



db.connect( (error) => {
    if(error){
        console.log(error)
    } else {
        console.log("---MYSQL Connected---")
    }
})


app.use('/', require('./routes/pages'))

app.use('/auth', require('./routes/auth'))



const isLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        res.locals.user = decoded;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};


app.listen(5005, () => {
console.log("Running server on port 5003")
});



