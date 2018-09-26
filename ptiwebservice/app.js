const express = require("express");
const app = express();

const locationRoutes = require("./api/routes/location");

app.use("/location", locationRoutes);

module.exports = app;