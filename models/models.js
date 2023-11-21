const db = require("../db/connection")
const endpointJSONfile = require(`../endpoints.json`)

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectAllArticles = () => {
    return db.query(`SELECT * FROM articles`)
    .then(({ rows }) => {
        return rows
    })
}

exports.getJSONmodel = () => {
    return endpointJSONfile
}