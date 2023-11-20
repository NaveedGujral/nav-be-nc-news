const { selectTopic } = require("../models/topics.models")

exports.getAllTopics = (req, res, next) => {
    const sqlStr = `SELECT * FROM topics;`
    selectTopic(sqlStr)
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
      })
}