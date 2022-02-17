const {selectArticle, incrementVote } = require('../models/articles-model')

exports.getArticle = (req, res, next) => {
    const {article_id: articleId} = req.params
    selectArticle(articleId)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.updateArticleVoteCount = (req, res, next) => {
    const {article_id: articleId } = req.params;
    const {inc_votes: newVote} = req.body
    incrementVote(articleId, newVote)
    .then((updatedArticle) => {
        res.status(202).send({updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}