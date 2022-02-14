const db = require('../db/connection')

exports.selectTopics = async () => {
    const response = await db.query("SELECT * FROM topics;")
    return response.rows
}

exports.selectArticle = (id) => {
    // green list for 400 bad request


    return db.query('SELECT * FROM articles WHERE articles.article_id = $1;', [id])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Item not found'})
        }
        return response.rows[0]
    })
}