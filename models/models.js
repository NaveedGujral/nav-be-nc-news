const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectAllCommentsByArtId = (artId) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = ${artId} SORT BY created_at ASC;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}