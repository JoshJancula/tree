// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all the numbers
  app.get("/api/numbers", function(req, res) {
    var query = {};
    if (req.query.id) {
      query.id = req.query.id;
    }

    db.LuckyNumber.findAll({
      where: query,
      include: [db.Person]
    }).then(function(data) {
      res.json(data);
    });
  });

  // GET rotue for retrieving one of the numbers
  app.get("/api/numbers/:id", function(req, res) {

    db.LuckyNumber.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Person]
    }).then(function(data) {
      res.json(data);
    });
  });

  // POST route for saving new numbers
  app.post("/api/numbers", function(req, res) {
    db.LuckyNumber.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  // DELETE route for deleting numbers
  app.delete("/api/numbers/:id", function(req, res) {
    db.LuckyNumber.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });


};
