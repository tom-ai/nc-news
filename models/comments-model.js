const db = require("../db/connection");
const format = require("pg-format");

exports.createNewComment = async (commentObject, articleId) => {
  const { username } = commentObject;
  const { body } = commentObject;

  const response = await db.query(
    `
    INSERT INTO comments
        (author, body, article_id)
    VALUES
        ($1, $2, $3) RETURNING *`,
    [username, body, articleId]
  );
  return response.rows[0];
};

exports.selectComments = async (id) => {
  const response = await db.query(
    `
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at desc`,
    [id]
  );

  if (response.rows.length === 0) {
    return Promise.reject({ status: "404", msg: "Not found" });
  } else return response.rows;
};

exports.removeComment = async (id) => {
  const response = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1`,
    [id]
  );

  if (response.rowCount === 0) {
    return Promise.reject({ status: "404", msg: "Not found" });
  }
};
