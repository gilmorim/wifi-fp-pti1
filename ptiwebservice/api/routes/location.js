const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	res.status(200).json({
		message: "a GET on this route should query the database for the users last recorded position"
	})
});

router.post("/", (req, res, next) => {

	//expected req format

		/*"userId" : " ",
		"timestamp" : " ",
		"fingerprint" : [{
				"mac" : "",
				"signal" : ""
		},
		{
				"mac" : "",
				"signal" : ""
		},
		{
				"mac" : "",
				"signal" : ""
		}]*/

	//response format
	res.status(200).json({
		"userId" : req.body.userId,
		"location" : "LAP3"
			})
});

router.post("/correct", (req, res, next) => {
	res.status(200).json({
		message: "a POST on this route should correct the users location on the database"
	})
});

module.exports = router;