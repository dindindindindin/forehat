const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
	const heading = req.query.heading.toString;
	const content = req.query.content.toString;
	const typeId = parseInt(req.query.type);
	const parentId = parseInt(req.query.parentId);
	const userId = req.query.userId.toString;

	const idea = await db.query(
		escape`INSERT INTO ideas (heading, content, idea_types_id, parent_id, users_id, created_at) VALUES (${heading}, ${content}, ${typeId}, ${parentId}, ${userId}, now());
SET @firstid := LAST_INSERT_ID();
SELECT id, created_at from ideas where id >= @firstid;`
	);

	const sketches = req.query.sketches;
	if (sketches.length > 0) {
		for (let i = 0; i < sketches.length; i++) {
			await db.query(
				escape`INSERT INTO sketches (ideas_id, users_id, sketch_url) VALUES (${idea}, ${userId}, ${sketches[i]});`
			);
		}
	}
	res.status(200).json({ idea });
};
