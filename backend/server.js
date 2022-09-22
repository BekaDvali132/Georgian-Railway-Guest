const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static("uploads"));

app.use("/api/countries", require("./routes/countryRoutes"));
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/customers', require('./routes/customerRoutes'))

app.listen(port, () => console.log(`server started on port ${port}`));
