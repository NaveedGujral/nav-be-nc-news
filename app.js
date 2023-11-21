const express = require("express");
const app = express()
const { getAllTopics, getJSONctrl } = require('./controllers/controllers.js');

app.get("/api/topics", getAllTopics)

/*
Description
Should:

be available on /api/articles/:article_id/comments.
get all comments for an article.
Responds with:

an array of comments for the given article_id of which each comment should have the following properties:
comment_id
votes
created_at
author
body
article_id
Comments should be served with the most recent comments first.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.
*/

app.get("")


app.get("/api", getJSONctrl)

module.exports = app