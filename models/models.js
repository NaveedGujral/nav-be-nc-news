const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectAllCommentsByArtId = (artId) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [artId])
    .then(({ rows }) => {
        const commentArray = rows

        if (commentArray.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `this article has no comments`
                })
            }
        return commentArray
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}