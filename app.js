const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

//get routes
const materialRoutes = require('./api/routes/materials');
const userRoutes = require('./api/routes/users');
//Init Express
const app = express();

app.use(morgan('dev'));

// Bodyparser Middileware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Handle CORS Headers Adjustments
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

//DB configuration
const db = require('./config/db_keys').mongoURI;
//Connect to MongoDB
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
    db,
    { useNewUrlParser: true },
)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));


//use routes
app.use('/materials', materialRoutes);
app.use('/users', userRoutes);

//handle route request error
app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
