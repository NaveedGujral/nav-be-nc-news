const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl, getAllCommentsByArtId } = require('./controllers/controllers.js');
const {customErrors, psqlErrors, serverErrors} = require("./errors.js")


app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id/comments", getAllCommentsByArtId)


app.get("/api", getJSONctrl)

app.use(customErrors)
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app