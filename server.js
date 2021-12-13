// Importing express as a function
const express = require('express');

// Import dotenv
require('dotenv').config();

// CORS (Cross-Origin Resource Sharing)
const cors = require('cors');

// Import express-form-data to process HTTP POST requests
const expressFormData = require('express-form-data');

// Import mongoose to connect to MongoDB Atlas
const mongoose = require('mongoose');
const UserModel = require('./models/UserModel.js');
const userRoutes = require('./routes/user-routes.js');

// Use passport, passport-jwt to read the clien't jwt
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;

const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}

// This function will tell passport how what to do
// with the payload.
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions,
            (jwtPayload, done) => {

                // Tell passport what to do with payload
                UserModel
                .findOne({ _id: jwtPayload._id })
                .then(
                    (dbDocument) => {
                        // The done() function will pass the 
                        // dbDocument to Express. The user's 
                        // document can then be access via req.user
                        return done(null, dbDocument)
                    }
                )
                .catch(
                    (err) => {
                        // If the _id or anything is invalid,
                        // pass 'null' to Express.
                        if(err) {
                            console.log(err);
                        }
                        return done(null, null)
                    }
                )

            }
        )
    )
};
passportJwt(passport)


// Import and configure Cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

// Run the express function to get the methods
const server = express(); 

// Configure express-form-data for server
// Is for reading HTML form data
server.use( expressFormData.parse() );
server.use( cors() );

// Declare the connnection string
const connectionString = process.env.MONGODB_CONNECTION_STRING;

// Create the mongoose config object
const connectionConfig = {
    'useNewUrlParser': true,
    'useUnifiedTopology': true
}

// Use the .connect() method to connect to MongoDB
mongoose
.connect( connectionString, connectionConfig )
// If connection successful, then...
.then(
    function() {
        console.log('DB is connected');
    }
)
.catch(
    function() {
        console.log('DB not connected');
    }
)

// This is only here to quicklt check that the backend is running
server.get('/', function(req, res){res.send('Welcome')});


server.use(
    '/user', userRoutes         // http://www.something.com/user/
);

// This is the last thing in your file
server.listen(
    process.env.PORT,
    function() {
        console.log('connected to http://localhost:3001/');
    }
);
