const express = require('express')
const { getTopics, getArticle } = require('./controllers/index')
const { customErrorHandler } = require('./errors')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.all('/api/*', (req, res) => {
    res.status(404).send({msg: 'Invalid path'})
})

app.use(customErrorHandler);

module.exports = app;