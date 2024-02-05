const express = require('express');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/RestaurantsRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/restaurants', restaurantRoutes);

const DB_CONNECTION_STRING = "mongodb+srv://sarahrami97:SKty2K30d9ZpKErX@cluster0.umsf83y.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Successfully connected to database");    
}).catch(err => {
    console.log('Failed to connect to database.', err);
    process.exit();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
