// Importing express as a function
const express = require('express');

// Import express-form-data to process HTTP POST requests
const expressFormData = require('express-form-data');

// Import mongoose to connect to MongoDB Atlas
const mongoose = require('mongoose');
const UserModel = require('./models/UserModel.js');

// Run the express function to get the methods
const server = express(); 

// Configure express-form-data for server
server.use( expressFormData.parse() );


// Declare the connnection string
const connectionString = "mongodb+srv://admin01:psx12345@cluster0.oikl7.mongodb.net/astrolabs_backend?retryWrites=true&w=majority"

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
// Otherwise, catch the problem...
// Note:
// dbError can about bad authentication, WiFi, Mongo is down, etc.
.catch(
    function(dbError) {
        console.log('error occured', dbError)
    }
)


server.get(
    '/',                            // https://www.something.com/
    function(req, res) {
        res.send("<h1>Welcome Home!</h1>");
    }
);

server.get(
    '/about',                            // https://www.something.com/about
    function(req, res) {
        res.send("<h1>About Us</h1>");
    }
);

server.get(
    '/contact',                         
    function(req, res) {
        res.send("<h1>Contact Us</h1>");
    }
);

server.get(
    '/terms-conditions',                         
    function(req, res) {
        res.send("<h1>Terms & Conditions</h1>");
    }
);

server.post(
    '/user/register',
    function(req, res) {

        // Client (browser, postman) POSTs this...
        const formData = {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'email': req.body.email,
            'password': req.body.password,
            'phone': req.body.phone
        }

        UserModel
        .create(formData)
        // If successful...
        .then(
            function() {
                // Express sends this...
                res.send("Thank you for the form. We will consider your account.")
            }
        )
        // If problem occurs, the catch the problem...
        .catch(
            function(dbError) {
                console.log('An error occured during .create()', dbError);
            }
        )

    }
);



server.post(
    '/price', 
    function(req, res) {

        // Product and price info
        // 'iphone13 ----> 5000'
        // 'iphone12 ----> 4000'
        // 'ps5 ----> 4000'
        // 's20 ----> 4700'
        // 'airpodsmax ----> 2500'

        // Hint: 
        // use if/else and res.send()
        // use req.body.product to check the price
        // Enter your solution below...

        let database = {
            'iphone13': '5000',
            'iphone12': '4000',
            'ps5': '3899',
            's20': '4700',
            'airpodsmax': '2500'
        }

        let requestedProduct = req.body.product; // 'iphone13'

        res.send(database[requestedProduct])
    }
);


// This is the last thing in your file
server.listen(
    3001,
    function() {
        console.log('connected to http://localhost:3001/')
    }
);
