const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
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

exports.getJSONmodel = () => {
    return endpointJSONfile
}

