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
        length: 300
      },
      like_count: {
        type: "int",
        length: 5
      },

      parent_id: {
        type: "int",
        unsigned: true,
        length: 10,
        foreignKey: {
          name: "parent_id_fk",
          table: "ideas",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          },
          mapping: "id"
        }
      },

      owner: { type: "string", length: 20 }
    },
    callback
  );
};

exports.down = function(db, callback) {
  db.dropTable("ideas", true, callback);
};

exports._meta = {
  version: 1
};
