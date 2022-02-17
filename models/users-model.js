const db = require('../db/connection')

exports.selectUsers = async () => {
    const response = await db.query('SELECT * FROM users')
    if (response.rows === 0)
    return response.rows
}