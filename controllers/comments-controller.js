const {createNewComment} = require('../models/comments-model') 

exports.postComment = (req, res, next) => {
    const { comment } = req.body
    const { article_id: articleId } = req.params
    
    createNewComment(comment, articleId)
    .then((postedComment) => {
        res.status(201).send({postedComment})
    })
    .catch(err => {
        console.log('in error', err)
    })
}