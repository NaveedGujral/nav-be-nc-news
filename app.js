const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl } = require('./controllers/controllers.js');

app.get("/api/topics", getAllTopics)
app.get("/api", getJSONctrl)

module.exports = app