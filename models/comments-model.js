const db = require('../db/connection')

exports.createNewComment = (comment, articleId) => {
    const username = comment.username;
    const body = comment.body

    console.log(articleId)

    const queryStr = `
        INSERT INTO comments
            (author, body, article_id)
        VALUES
            (%I, %I, %I);`

    return db.query(`
        )
}