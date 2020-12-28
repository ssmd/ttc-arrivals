const functions = require("firebase-functions");
const restbus = require("restbus");
var cors = require("cors");
const express = require("express");
var app = express();

var whitelist = ["https://ttcarrivals.web.app", "http://localhost:3000", "https://ttcarrivals.firebaseapp.com"];
app.use(cors())
app.use("/", function (req, res, next) {
    let isDomainAllowed = whitelist.indexOf(req.header("Origin")) !== -1;
    console.log(isDomainAllowed)
    if (isDomainAllowed) {
		next()
	} else {
        console.log("Forbidden Request");
        res.status(403).send('Sorry, cant find that');
    }
    
  }, restbus.middleware());

app.listen(80, function() {
    console.log("Forbidden");
});

exports.api = functions.https.onRequest(app);
