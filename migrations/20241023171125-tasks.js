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
  return db
    .createTable(
      "TaskLists",
      {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        name: { type: "varchar", length: 200, notNull: true },
        createdByUserId: { type: "int" },
        created_at: {
          type: "timestamp",
          defaultValue: new String("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: "timestamp",
          defaultValue: new String("CURRENT_TIMESTAMP"),
          onUpdate: "CURRENT_TIMESTAMP",
        },
      },
      { ifNotExists: true }
    )
    .then(() =>
      db.createTable(
        "Tasks",
        {
          id: { type: "int", primaryKey: true, autoIncrement: true },
          name: { type: "varchar", length: 200, notNull: true },
          note: { type: "text" },
          isComplete: { type: "boolean", defaultValue: false },
          createdByUserId: { type: "int" },
          taskListId: { type: "int" },
          created_at: {
            type: "timestamp",
            defaultValue: new String("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: "timestamp",
            defaultValue: new String("CURRENT_TIMESTAMP"),
            onUpdate: "CURRENT_TIMESTAMP",
          },
        },
        { ifNotExists: true }
      )
    )
    .then(() => {
      return db.createTable(
        "Teams",
        {
          id: { type: "int", primaryKey: true, autoIncrement: true },
          name: { type: "varchar", length: 200, notNull: true },
          created_at: {
            type: "timestamp",
            defaultValue: new String("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: "timestamp",
            defaultValue: new String("CURRENT_TIMESTAMP"),
            onUpdate: "CURRENT_TIMESTAMP",
          },
        },
        { ifNotExists: true }
      );
    })
    .then(() => {
      return db.createTable(
        "TeamMembers",
        {
          teamId: { type: "int", primaryKey: true },
          userId: { type: "int", primaryKey: true },
        },
        { ifNotExists: true }
      );
    })
    .then(() => {
      return db.addForeignKey(
        "Tasks",
        "Users",
        "fk_tasks_createdByUserId",
        { createdByUserId: "id" },
        { onDelete: "CASCADE" }
      );
    })
    .then(() => {
      return db.addForeignKey(
        "Tasks",
        "TaskLists",
        "fk_tasks_taskListId",
        { taskListId: "id" },
        { onDelete: "SET NULL" }
      );
    })
    .then(() => {
      return db.addForeignKey(
        "TeamMembers",
        "Teams",
        "fk_teamMembers_teamId",
        { teamId: "id" },
        { onDelete: "CASCADE" }
      );
    })
    .then(() => {
      return db.addForeignKey(
        "TeamMembers",
        "Users",
        "fk_teamMembers_userId",
        { userId: "id" },
        { onDelete: "CASCADE" }
      );
    });
};

exports.down = function (db) {
  return db
    .dropTable("TeamMembers")
    .then(() => db.dropTable("Tasks"))
    .then(() => db.dropTable("TaskLists"))
    .then(() => db.dropTable("Teams"));
};

exports._meta = {
  version: 1,
};
