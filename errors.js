// Custom errors
exports.customErrorHandler = (err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})
}

// PSQL errors
