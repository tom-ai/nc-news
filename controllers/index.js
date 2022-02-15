const { checkout } = require('../app')
const { selectTopics, selectArticle } = require('../models/index')
const checkExists = require('../db/helpers/utils')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

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