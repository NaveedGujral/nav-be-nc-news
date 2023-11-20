const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { psqlErrors, customErrors, serverErrors } = require("./errors");
const app = express()

app.use(express.json())

function getApi (req, res) {
    res.status(200).send({ msg : 'all okay'})
};
app.get("/api/healthcheck", getApi);

app.get("/api/topics", getAllTopics)

app.use(psqlErrors)
app.use(customErrors)
app.use(serverErrors)

module.exports = app