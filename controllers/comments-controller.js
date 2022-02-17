const comments = require("../db/data/test-data/comments")
const { selectComments } = require("../models/comments-model")


exports.getComments = (req, res, next) => {
    const {article_id: articleId} = req.params;
    selectComments(articleId)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}