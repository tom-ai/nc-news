
const db = require("../db/connection");
const format = require("pg-format");

exports.createNewComment = (comment, articleId) => {
  const username = comment.username;
  const body = comment.body;

  return db
    .query(
      `
        INSERT INTO comments
            (author, body, article_id)
        VALUES
            ($1, $2, $3) RETURNING *`,
      [username, body, articleId]
    )
    .then((result) => {
      return result.rows[0];
    });
};


exports.selectComments = (id) => {
    return db.query(`
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1`, [id])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: '404', msg: 'Not found'})
        }
        return response.rows
    })
}

