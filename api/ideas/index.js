const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
  let childIdeas;
  let idea;
  var childCounts = {};

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

    childIdeas.map(async ideax => {
      const childCount = await db.query(
        escape`SELECT COUNT(*) FROM ideas WHERE parent_id = ${ideax.id};`
      );

      const ideaId = ideax.id;

      const count = childCount[0]["COUNT(*)"];

      childCounts[ideaId] = count;
      console.log(JSON.stringify(childCounts));
    });
  }
  console.log(JSON.stringify(childCounts));
  //  const childCounts = JSON.stringify(childCounts);

  res.status(200).json({ childIdeas, childCounts });
};
