const express = require('express')
const { getTopics } = require('./controllers/index')

const app = express()

app.get('/api/topics', getTopics)

app.all('/api/*', (req, res) => {
    res.status(404).send({msg: 'Invalid path'})
})

app.use((err, req, res, next) => {
    console.log(err)
});

module.exports = app;