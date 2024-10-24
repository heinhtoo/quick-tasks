/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("Users", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    username: { type: "varchar", length: 200, notNull: true },
    created_at: {
      type: "timestamp",
      defaultValue: new String("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      defaultValue: new String("CURRENT_TIMESTAMP"),
      onUpdate: "CURRENT_TIMESTAMP",
    },
  });
};

exports.down = function (db) {
  return db.dropTable("Users");
};

exports._meta = {
  version: 1,
};
