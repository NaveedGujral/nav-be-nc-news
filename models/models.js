const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (artId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${artId}`)
    .then(({ rows }) => {
        // console.log(rows)
        return rows
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}