const db = require('../db/connection')

exports.selectArticle = async (articleId) => {

    return db.query('SELECT * FROM articles WHERE articles.article_id = $1;', [articleId])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Item not found'})
        }
        return response.rows[0]
    })
}

exports.incrementVote = async (articleId, vote) => {   
    return db.query('SELECT * FROM articles WHERE articles.article_id = $1;', [articleId])
    .then(({rows: [article]}) => {
        article.votes = vote
        return article;
    })
}