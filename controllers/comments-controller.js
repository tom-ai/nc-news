const { selectComments, createNewComment, removeComment} = require('../models/comments-model') 
const { checkUserExists } = require('../db/helpers/utils')

exports.postComment = async (req, res, next) => {
    const { comment } = req.body
    const { article_id: articleId } = req.params

    createNewComment(comment, articleId)
    .then((postedComment) => {
        res.status(201).send({postedComment})
    })
    .catch(err => {
        next(err)
    })
}

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

exports.deleteCommentById = (req, res, next) => {
    const { comment_id: commentId } = req.params
    removeComment(commentId)
    .then((response) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        next(err)
    })
}