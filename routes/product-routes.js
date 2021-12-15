const express = require('express');
const router = express.Router();
const ProductModel = require('../models/ProductModel.js');

// Post a new product
// http://localhost:3001/products/create
router.post('/create',
    (req, res) => {

        // Use the UserModel to create a new document
        ProductModel
        .create(
            {
                brand: req.body.brand,
                model: req.body.model,
                origin: req.body.origin,
                description: req.body.description,
                color: req.body.color,
                price: req.body.price
            }
        )
        .then(
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        );
    }
);

module.exports = router;