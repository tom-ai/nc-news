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
    } else if (err.code === '23502') {
        res.status(400).send({msg: 'Malformed body'})
    } 
    
    else if (err.code === '23503') {
        res.status(404).send({msg: 'Not found'})
    } 
    else {
        console.log('psql error not yet translated...', err)
    }
}