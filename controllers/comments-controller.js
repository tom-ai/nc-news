const {createNewComment} = require('../models/comments-model') 


exports.postComment = (req, res, next) => {
    const {article_id: articleId } = req.params
    const { comment } = req.body

    createNewComment(comment, articleId)
    .then((response) => {
        // console.log(response)
    })
}