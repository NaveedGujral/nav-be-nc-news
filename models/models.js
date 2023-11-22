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
        const article = rows[0]
        if (article === undefined) {
            return Promise.reject({
                status: 404,
                msg: `article does not exist`
            })
        }
        return article
    })
}
      
      
exports.selectAllArticles = () => {
    
    return db.query(`SELECT 
    articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;`)

    .then(({ rows }) => {
        const articles = rows
        articles.forEach((article) => {
            article.comment_count = +article.comment_count
        })
        return articles
    })
}

exports.selectAllCommentsByArtId = (artId) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [artId])
    .then(({ rows }) => {
        const commentArray = rows
        return commentArray
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}

