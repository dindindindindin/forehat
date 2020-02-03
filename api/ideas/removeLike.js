const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
	const ideaId = parseInt(req.query.ideaId);
	const userId = req.query.userId.toString();

	await db.query(
		escape`DELETE FROM likes WHERE ideas_id = ${ideaId} AND users_id = ${userId});`
	);
};
