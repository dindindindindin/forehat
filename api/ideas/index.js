const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
	let childIdeas = [];
	let childCounts = {};
	let likeCounts = {};
	let userLikes = {};
	let idea;

	if (req.query.user !== undefined) {
		const userId = req.query.user.toString();

		if (req.query.parent !== "null") {
			const parentId = parseInt(req.query.parent);

			childIdeas = await db.query(
				escape`SELECT * FROM ideas WHERE parent_id = ${parentId};`
			);

			for (let i = 0; i < childIdeas.length; i++) {
				const childsParentId = parseInt(childIdeas[i].parent_id);

				if (childsParentId === parentId) {
					const childCount = await db.query(
						escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${childIdeas[i].id};`
					);
					const likeCount = await db.query(
						escape`SELECT COUNT(*) FROM likes WHERE ideas_id = ${childIdeas[i].id};`
					);

					const didUserLike = await db.query(
						escape`SELECT CASE WHEN EXISTS(SELECT * FROM likes WHERE users_id = ${userId} AND ideas_id = ${childIdeas[i].id}) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END;`
					);

					if (didUserLike === true)
						userLikes[childIdeas[i].id] = true;

					childCounts[childIdeas[i].id] = childCount[0]["COUNT(*)"];
					likeCounts[childIdeas[i].id] = likeCount[0]["COUNT(*)"];
				}
			}
		} else {
			childIdeas = await db.query(
				escape`SELECT * FROM ideas WHERE parent_id IS NULL;`
			);

			for (let i = 0; i < childIdeas.length; i++) {
				const childCount = await db.query(
					escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${childIdeas[i].id};`
				);
				const likeCount = await db.query(
					escape`SELECT COUNT(*) FROM likes WHERE ideas_id = ${childIdeas[i].id};`
				);

				const didUserLike = await db.query(
					escape`SELECT CASE WHEN EXISTS(SELECT * FROM likes WHERE users_id = ${userId} AND ideas_id = ${childIdeas[i].id}) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END;`
				);

				if (didUserLike === true) {
					userLikes[childIdeas[i].id] = true;
				}

				childCounts[childIdeas[i].id] = childCount[0]["COUNT(*)"];
				likeCounts[childIdeas[i].id] = likeCount[0]["COUNT(*)"];
			}
		}
	} else {
		if (req.query.parent !== "null") {
			const parentId = parseInt(req.query.parent);

			childIdeas = await db.query(
				escape`SELECT * FROM ideas WHERE parent_id = ${parentId};`
			);

			for (let i = 0; i < childIdeas.length; i++) {
				const childsParentId = parseInt(childIdeas[i].parent_id);

				if (childsParentId === parentId) {
					const childCount = await db.query(
						escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${childIdeas[i].id};`
					);
					const likeCount = await db.query(
						escape`SELECT COUNT(*) FROM likes WHERE ideas_id = ${childIdeas[i].id};`
					);

					childCounts[childIdeas[i].id] = childCount[0]["COUNT(*)"];
					likeCounts[childIdeas[i].id] = likeCount[0]["COUNT(*)"];
				}
			}
		} else {
			childIdeas = await db.query(
				escape`SELECT * FROM ideas WHERE parent_id IS NULL;`
			);

			for (let i = 0; i < childIdeas.length; i++) {
				const childCount = await db.query(
					escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${childIdeas[i].id};`
				);
				const likeCount = await db.query(
					escape`SELECT COUNT(*) FROM likes WHERE ideas_id = ${childIdeas[i].id};`
				);

				childCounts[childIdeas[i].id] = childCount[0]["COUNT(*)"];
				likeCounts[childIdeas[i].id] = likeCount[0]["COUNT(*)"];
			}
		}
	}

	res.status(200).json({ childIdeas, childCounts, likeCounts, userLikes });
};
