const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const pool =require('./database/db');

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/api/countries', require('./routes/countryRoutes'))

app.listen(port, () => console.log(`server started on port ${port}`))