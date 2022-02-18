const db = require("../db/connection");
const format = require("pg-format");
const { checkUserExists } = require("../db/helpers/utils");

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
