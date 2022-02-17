const db = require('../db/connection')

exports.selectTopics = async () => {
    const response = await db.query("SELECT * FROM topics;")
    return response.rows
}

