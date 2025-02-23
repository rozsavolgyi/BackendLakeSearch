const path = require('path')
const express = require('express')
require('dotenv').config() // A .env fájlt olvassa
const cors = require('cors'); // CORS importálása
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
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


const app = express()
app.use(cors({
    origin: 'http://localhost:4200', // Engedélyezi a frontendet
    credentials: true
}));

app.use(express.json())
app.use(morgan('dev'))

app.use(fileUpload())



app.use("/tavak", TavakRoutes)
app.use(errorHandler)
app.get('/', (req, res) => {
    res.status(400).json({ success: false})
})

app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`));