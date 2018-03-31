const clientRoutes     = require('./client');
const composantRoutes  = require('./composant');
const homeRoutes  = require('./home');

module.exports = function(app, db) {
  clientRoutes(app, db);
  composantRoutes(app, db);
  homeRoutes(app, db);
};
