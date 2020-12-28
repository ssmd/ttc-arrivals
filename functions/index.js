const functions = require("firebase-functions");
const restbus = require("restbus");
const express = require("express");
var app = express();
// // var restbus = require('restbus');

// // (As express middleware)
app.use("/", restbus.middleware());
app.listen(80);

exports.api = functions.https.onRequest(app);
