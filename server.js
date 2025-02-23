const path = require('path')
const express = require('express')
require('dotenv').config() // A .env fájlt olvassa
const cors = require('cors'); // CORS importálása
const morgan = require('morgan')
const fileUpload = require('express-fileupload')

