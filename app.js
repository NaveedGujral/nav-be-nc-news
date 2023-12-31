const express = require("express");
const app = express()
const cors = require('cors')

const { getAllTopics, getJSONctrl, getAllArticles, getArticleById,  getAllCommentsByArtId, postComment, getPatchedArticleById,  deleteComment, getAllUsers  } = require('./controllers/controllers.js');
const { psqlErrors, customErrors, serverErrors } = require("./errors.js");

app.use(cors());
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api/articles/:article_id/comments", getAllCommentsByArtId)
app.get("/api", getJSONctrl)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api", getJSONctrl)
app.get("/api/users", getAllUsers)

app.patch("/api/articles/:article_id", getPatchedArticleById)

app.post("/api/articles/:article_id/comments", postComment)

app.delete("/api/comments/:comment_id", deleteComment)

app.use(customErrors)
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app