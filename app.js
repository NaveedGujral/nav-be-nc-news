const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl, getArticleById } = require('./controllers/controllers.js');
const { psqlErrors, customErrors, serverErrors } = require("./errors.js");

app.get("/api/topics", getAllTopics)
app.get("/api", getJSONctrl)
app.get("/api/articles/:article_id", getArticleById)

app.use(customErrors)
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app