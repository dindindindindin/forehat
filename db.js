const mysql = require("serverless-mysql");
const dotenv = require("dotenv");

dotenv.config();
const { MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PW } = process.env;

const db = mysql({
  config: {
    host: MYSQL_HOST,
    database: MYSQL_DB,
    user: MYSQL_USER,
    password: MYSQL_PW
  }
});

exports.query = async query => {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};
