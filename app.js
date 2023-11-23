const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl, getAllArticles, getArticleById,  getAllCommentsByArtId  } = require('./controllers/controllers.js');
const { psqlErrors, customErrors, serverErrors } = require("./errors.js");

app.get("/api/topics", getAllTopics)
app.get("/api/articles/:article_id/comments", getAllCommentsByArtId)
app.get("/api", getJSONctrl)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)





app.use(customErrors)
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app