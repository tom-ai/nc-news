const db = require('../db/connection')

exports.selectArticles = async () => {
  const response = await db.query(
    "SELECT * FROM articles ORDER BY articles.created_at DESC"
  );
  return response.rows;
};