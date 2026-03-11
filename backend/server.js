const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDb = require('./src/config/db');
const userrouter = require('./src/router/user.router');
const errorHandler = require('./src/middleware/error.middleware');
const productrouter = require("./src/router/product.router");
const orderRouter = require('./src/router/order.router')
const reviewRoutes = require('./src/router/review.router');
const heroRoutes = require('./src/router/hero.router');
const PostRouter = require("./src/router/post.router");
const settingRouter = require("./src/router/settings.router");
dotenv.config();
connectDb();

const app = express();

// ----- MIDDLEWARES -----
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

// ----- ROUTES -----
app.use("/api/auth", userrouter);
app.use("/api/product", productrouter);
app.use("/api", orderRouter);
app.use("/api/review", reviewRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/posts", PostRouter);
app.use("/api/settings", settingRouter);

// ----- GLOBAL ERROR MIDDLEWARE (MUST BE LAST) -----
app.use(errorHandler);


// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
