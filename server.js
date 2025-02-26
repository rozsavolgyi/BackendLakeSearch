const path = require('path')
const express = require('express')
require('dotenv').config() // A .env fájlt olvassa
const cors = require('cors'); // CORS importálása
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')


const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
console.log('MongoDB URI:', process.env.DATABASE_URL);

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log(`Database Connected ${database.host}`);
});

const auth = require('./routes/auth')
const TavakRoutes=require('./routes/lake')
const typicalfish=require('./routes/typicalFish');
const county=require('./routes/county')
const method=require('./routes/method')
const fish=require('./routes/fish')

const app = express()

app.use(cors({
    origin: 'http://localhost:4200', // Engedélyezi a frontendet
    credentials: true
}));

// body parser
app.use(express.json())

// cookie parser
app.use(cookieParser())

app.use(morgan('dev'))

app.use(fileUpload())

// app.use(express.static(path.join(__dirname, 'public')))
app.use("/auth", auth);
app.use("/tavak", TavakRoutes)
app.use("/typicalFish", typicalfish)
app.use("/county", county)
app.use("/method", method)
app.use("/fish", fish)
app.use(errorHandler)
app.get('/', (req, res) => {
    res.status(400).json({ success: false})
})

app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`));