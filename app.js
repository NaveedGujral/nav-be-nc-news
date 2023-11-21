const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl, getArticleById } = require('./controllers/controllers.js');
const { psqlErrors } = require("./errors.js");

app.get("/api/topics", getAllTopics)
app.get("/api", getJSONctrl)
app.get("/api/articles/:article_id", getArticleById)

app.use(psqlErrors)

module.exports = app