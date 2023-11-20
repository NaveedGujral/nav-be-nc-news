const db = require("../db/connection")

exports.selectTopic = (sqlStr) => {
    return db.query(sqlStr)
    .then(({ rows }) => {
        return rows
    })
}