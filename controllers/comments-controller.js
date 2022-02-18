const {createNewComment} = require('../models/comments-model') 
const { checkUserExists } = require('../db/helpers/utils')

exports.postComment = async (req, res, next) => {
    const { comment } = req.body
    const { article_id: articleId } = req.params
    
    const userCheck = await checkUserExists()
    
    // console.log(userCheck)

    createNewComment(comment, articleId)
    .then((postedComment) => {
        res.status(201).send({postedComment})
    })
    .catch(err => {
        next(err)
    })
}