const express = require('express')

const { getArticleById, updateArticleVoteCount, getArticles } = require('./controllers/articles-controller')
const { getComments, postComment, deleteCommentById } = require('./controllers/comments-controller')
const { getTopics  } = require('./controllers/topics-controller')
const { getUsers } = require('./controllers/users-controller')
const { getEndpoints } = require('./controllers/endpoints-controller')

const { customErrorHandler, psqlErrorHandler } = require('./errors')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getComments)
app.patch('/api/articles/:article_id', updateArticleVoteCount)
app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)


app.get('/api', getEndpoints)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.all('/api/*', (req, res) => {
    res.status(404).send({msg: 'Not found'})
})

app.use(customErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;