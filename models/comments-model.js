const db = require('../db/connection')

exports.selectComments = (id) => {

    // if (typeof id != 'number') {
    //     next()
    // }

    return db.query(`
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1`, [id])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: '404', msg: 'Article not found'})
        }
        return response.rows
    })
}
