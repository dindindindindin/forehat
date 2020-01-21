const db = require("../../db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
  const parentId = parseInt(req.query.parent);
  const ideas = await db.query(escape`
SELECT * FROM ideas
WHERE parent_id = ${parentId};
`);
  const childCounts = {};
  let idea;
  for (idea in ideas) {
    const childCount = await db.query(escape`
SELECT COUNT(*) FROM ideas
WHERE parent_id = ${parentId};
`);
    childCounts[ideas.id] = childCount;
  }
  res.status(200).json({ ideas, childCounts });
};
