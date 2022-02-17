const db = require('../db/connection')

exports.selectArticle = async (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE articles.article_id = $1;", [
      articleId,
    ])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Item not found" });
      }
      return response.rows[0];
    });
};

exports.incrementVote = async (articleId, vote) => {
  if (!vote) {
    return Promise.reject({ status: 400, msg: "Invalid vote" });
  }
  return db
    .query("SELECT * FROM articles WHERE articles.article_id = $1;", [
      articleId,
    ])
    .then(({ rows: [article] }) => {
      article.votes = vote;
      return article;
    });
};

exports.selectArticles = async () => {
  const response = await db.query(
    "SELECT * FROM articles ORDER BY articles.created_at DESC;"
  );
  return response.rows;
};
