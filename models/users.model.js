const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  // GETS THE OATH OF NEDB IN THE CONFIGURATION
  // THIS IS ALL ABOUT GETTING THE DATABASE SETUP AND HAS NOTHING TO DO WITH FEATHERS
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'users.db'),
    autoload: true
  });

  Model.ensureIndex({ fieldName: 'email', unique: true });

  return Model;
};
