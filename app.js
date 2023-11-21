const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl, getAllArticles } = require('./controllers/controllers.js');

app.get("/api/topics", getAllTopics)
app.get("/api", getJSONctrl)
app.get("/api/articles", getAllArticles)

module.exports = app