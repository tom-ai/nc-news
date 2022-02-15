// Custom errors
exports.customErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

// PSQL errors
exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid ID'})
    } else {
        console.log('psql error not yet translated...', err)
    }
}