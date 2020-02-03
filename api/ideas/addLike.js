const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
	const ideaId = parseInt(req.query.ideaId);
	const userId = req.query.userId.toString();

	await db.query(
		escape`INSERT INTO likes (ideas_id, users_id) VALUES (${ideaId}, ${userId});`
	);
};
