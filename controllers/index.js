const { selectTopics, selectArticle } = require('../models/index')


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
    const {article_id} = req.params
    selectArticle(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        return next(err)
    })
}