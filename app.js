const express = require('express')
const { getTopics, getArticle } = require('./controllers/index')
const { customErrorHandler, psqlErrorHandler } = require('./errors')
const app = express()

const {getArticles} = require('./controllers/articles-controller')


app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)



app.get('/api/articles', getArticles)


app.all('/api/*', (req, res) => {
    res.status(404).send({msg: 'Invalid path'})
})


app.use(customErrorHandler);
app.use(psqlErrorHandler);


module.exports = app;