const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (artId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [artId])
    .then(({ rows }) => {
        const article = rows
        if (article.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `article does not exist`
            })
        }
        return article
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}