const express = require('express');
const app = express();
const Restaurant = require('../models/Restaurant');

// ADD RESTAURANT
// http://localhost:3000/restaurants
app.post('/', async (req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        cuisine: req.body.cuisine,
        city: req.body.city,
        restaurant_id: req.body.restaurant_id,
        address: req.body.address
    });

    try {
        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET ALL
// http://localhost:3000/restaurants
app.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL BY CUISINE
// http://localhost:3000/restaurants/cuisine/ (Japanese, Bakery, Italian)
app.get('/cuisine/:cuisine', async (req, res) => {
    try {
        const { cuisine } = req.params;
        const restaurants = await Restaurant.find({ cuisine: cuisine });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET DETAILS SORTED BY ID
app.get('/sort', async (req, res) => {
    try {
        const sortQuery = req.query.sortBy === 'DESC' ? '-restaurant_id' : 'restaurant_id';
        const restaurants = await Restaurant.find({}, 'id cuisines name city restaurant_id').sort(sortQuery);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET RESTAURANT WITH Delicatessen CUISINE SORTED ASC, "CITY NOT Brooklyn"
// http://localhost:3000/restaurants/Delicatessen
app.get('/Delicatessen', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            cuisine: 'Delicatessen',
            city: { $ne: 'Brooklyn' }
        }, 'cuisines name city -_id').sort('name');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET RESTAURANT BY ID
// http://localhost:3000/restaurants/:id
app.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Cannot find restaurant' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE RESTAURANT
// http://localhost:3000/restaurants/:id
app.put('/:id', async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Cannot find restaurant' });
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json({message: "restaurant updated."});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE BY ID
// http://localhost:3000/restaurants/:id
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Restaurant.deleteOne({ _id: id });

        if (result.deletedCount === 1) {
            res.json({ message: 'Deleted Restaurant' });
        } else {
            res.status(404).json({ message: 'Cannot find restaurant' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;


