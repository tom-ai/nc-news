const db = require('../db/connection')

exports.selectTopics = async () => {
    const {rows: topics} = await db.query("SELECT * FROM topics;")
    return topics
}

