const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const locationRoutes = require("./api/routes/location");
const spacesRoutes = require("./api/routes/spaces");
const usersRoutes = require("./api/routes/users");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded(({
	extended: false
})));

app.use(bodyParser.json());

app.use("/location", locationRoutes);
app.use("/spaces", spacesRoutes);
app.use("/users", usersRoutes);

//Error handling
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	});
});

module.exports = app;