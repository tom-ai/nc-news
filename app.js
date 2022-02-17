const express = require('express')

const { getArticle } = require('./controllers/articles-controller')
const {getUsers} = require('./controllers/users-controller')

const { getTopics  } = require('./controllers/topics-controller')


const { customErrorHandler, psqlErrorHandler } = require('./errors')
const {getArticle, updateArticleVoteCount } = require('./controllers/articles-controller')

const app = express()
app.use(express.json())

const {getArticles} = require('./controllers/articles-controller')


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)
app.patch('/api/articles/:article_id', updateArticleVoteCount)

app.get('/api/users', getUsers)



app.get('/api/articles', getArticles)


app.all('/api/*', (req, res) => {
    res.status(404).send({msg: 'Invalid path'})
})


app.use(customErrorHandler);
app.use(psqlErrorHandler);


module.exports = app;