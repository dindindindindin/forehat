const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
  let childIdeas;
  let idea;
  let childCounts = {};

  if (req.query.parent !== "null") {
    const parentId = parseInt(req.query.parent);

    childIdeas = await db.query(
      escape`SELECT * FROM ideas WHERE parent_id = ${parentId};`
    );

    for (idea in childIdeas) {
      if (idea.id === parentId) {
        const childCount = await db.query(
          escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${idea.id};`
        );

        const ideaId = idea.id.toString();

        childCounts[ideaId] = parseInt(childCount);
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

      childCounts[childIdeas[i].id] = childCount[0]["COUNT(*)"];
    }
  }

  res.status(200).json({ childIdeas, childCounts });
};
