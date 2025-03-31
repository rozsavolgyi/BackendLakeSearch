const path = require('path');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const mongoose = require('mongoose');

mongoose.set("strictQuery", true);
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log(`Database Connected ${database.host}`);
});

const auth = require('./routes/auth');
const TavakRoutes = require('./routes/lake');
const typicalfish = require('./routes/typicalFish');
const county = require('./routes/county');
const method = require('./routes/method');
const fish = require('./routes/fish');
const Catch = require('./routes/catch');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/auth", auth);
app.use("/tavak", TavakRoutes);
app.use("/typicalFish", typicalfish);
app.use("/county", county);
app.use("/method", method);
app.use("/fish", fish);
app.use("/catch", Catch);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(400).json({ success: false });
});

// Csak akkor indítunk szervert, ha NEM tesztelünk
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}

module.exports = app;
