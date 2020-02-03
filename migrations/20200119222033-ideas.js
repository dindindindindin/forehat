"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function(db, callback) {
	db.createTable(
		"users",
		{
			id: { type: "string", primaryKey: true, notNull: true, length: 20 }
		},
		callback
	);

	db.createTable(
		"idea_types",
		{
			id: {
				type: "int",
				primaryKey: true,
				unsigned: true,
				notNull: true,
				autoIncrement: true,
				length: 1
			},
			type: { type: "string", length: 20 }
		},
		callback
	);

	db.createTable(
		"ideas",
		{
			id: {
				type: "int",
				primaryKey: true,
				unsigned: true,
				notNull: true,
				autoIncrement: true,
				length: 10
			},
			title: {
				type: "string",
				length: 50
			},
			content: {
				type: "string",
				length: 5000
			},
			idea_types_id: {
				type: "int",
				unsigned: true,
				length: 1,
				foreignKey: {
					name: "ideas_idea_types_id_fk",
					table: "idea_types",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			},
			parent_id: {
				type: "int",
				unsigned: true,
				length: 10,
				foreignKey: {
					name: "parent_id_ideas_id_fk",
					table: "ideas",
					rules: {
						onDelete: "CASCADE",
						onUpdate: "RESTRICT"
					},
					mapping: "id"
				}
			},

			users_id: {
				type: "string",
				length: 20,
				foreignKey: {
					name: "ideas_users_id_fk",
					table: "users",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			}
		},
		callback
	);
	db.createTable(
		"sketches",
		{
			id: {
				type: "int",
				primaryKey: true,
				notNull: true,
				unsigned: true,
				length: 10,
				autoIncrement: true
			},
			ideas_id: {
				type: "int",
				unsigned: true,
				length: 10,
				foreignKey: {
					name: "sketches_ideas_id_fk",
					table: "ideas",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			},
			users_id: {
				type: "string",
				length: 20,
				foreignKey: {
					name: "sketches_users_id_fk",
					table: "users",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			},
			sketch_url: { type: "string", length: "100" }
		},
		callback
	);
	db.createTable(
		"likes",
		{
			ideas_id: {
				type: "int",
				unsigned: true,
				length: 10,
				foreignKey: {
					name: "likes_ideas_id_fk",
					table: "ideas",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			},
			users_id: {
				type: "string",
				length: 20,
				foreignKey: {
					name: "likes_users_id_fk",
					table: "users",
					rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
					mapping: "id"
				}
			}
		},
		callback
	);
};

exports.down = function(db, callback) {
	db.dropTable("likes", true, callback);
	db.dropTable("sketches", true, callback);
	db.dropTable("ideas", true, callback);
	db.dropTable("idea_types", true, callback);
	db.dropTable("users", true, callback);
};

exports._meta = {
	version: 1
};
