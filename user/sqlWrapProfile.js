'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const dbp = new sql.Database("Profile.db");

// check if database exists
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='Profile' ";

dbp.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createActivityTable();
  } else {
        console.log("Database file found");
  }
});

// called to create table if needed
function createActivityTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE Profile (id INTEGER, givenName TEXT)';
  dbp.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// wrap all database commands in promises
dbp.run = util.promisify(dbp.run);
dbp.get = util.promisify(dbp.get);
dbp.all = util.promisify(dbp.all);

// empty all pdata from db
dbp.deleteEverything = async function() {
  await dbp.run("delete from Profile");
  dbp.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = dbp;
