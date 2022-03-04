const { readFile } = require("fs/promises");

exports.selectEndpoints = async () => {
  const response = await readFile(`${__dirname}/../endpoints.json`, "utf-8");
  return JSON.parse(response);
};
