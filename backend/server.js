const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDb = require('./src/config/db');
const userrouter = require('./src/router/user.router');
const errorHandler = require('./src/middleware/error.middleware');   
const productrouter=require("./src/router/product.router");

dotenv.config();
connectDb();

const app = express();

// ----- MIDDLEWARES -----
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----- ROUTES -----
app.use("/api/auth", userrouter);
app.use("/api/product",productrouter);

// ----- GLOBAL ERROR MIDDLEWARE (MUST BE LAST) -----
app.use(errorHandler);  


// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
