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

exports.selectCommentById = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
        const comment = rows[0]
        if (comment === undefined) {
            return Promise.reject({
                status: 404,
                msg: `comment does not exist`
            })
        }
        return comment
    })
}

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => {
        const users = rows
        return users
    })
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
        const user = rows[0]
        if (user === undefined) {
            return Promise.reject({
                status: 404,
                msg: `user does not exist`
            })
        }
        return user
    })
}
           
exports.selectAllArticles = (topic) => {
    let dbQueryStr = `SELECT 
    articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;`

    let valArr = []

    if(topic) {
        dbQueryStr = `SELECT 
        articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE topic = $1
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
        ;`,
        valArr.push(topic)
    }

    return db.query(dbQueryStr, valArr)
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

exports.updateArticleVotes = (newVote, artId) => {
    const sqlStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
    const valArr = [ newVote, artId ]

    return db.query(sqlStr, valArr)
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

exports.insertComment = (reqBody, artId) => {
    const { username, body } = reqBody

    if (!username || !body) {
        {
            return Promise.reject({
                status: 400,
                msg: `Bad Request`
            })
        }
    }

    const sqlStr = `INSERT INTO comments ( author, body, article_id ) VALUES ( $1, $2, $3 ) RETURNING *`

    const valArray = [ username, body, artId ]

    return db.query(sqlStr, valArray)
    .then((table) => {
        const comment = table.rows[0]
        return comment
    })
}

exports.removeComment = (comment_id) => {
    const sqlStr = `DELETE FROM comments WHERE comment_id = $1`
    const valArray = [ comment_id ]
    return db.query(sqlStr, valArray)
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}