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
  return db.addIndex("Users", "unique_username", ["username"], true);
};

exports.down = function (db) {
  return db.removeIndex("Users", "unique_username");
};

exports._meta = {
  version: 1,
};
