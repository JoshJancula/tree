// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all people
  app.get("/api/people", function(req, res) {

    db.Person.findAll({
      include: [db.LuckyNumber]
    }).then(function(data) {
      res.json(data);
    });
  });

  // Get rotue for retrieving a single person
  app.get("/api/people/:id", function(req, res) {

    db.Person.findOne({
      where: {
        id: req.params.id
      },
      include: [db.LuckyNumber]
    }).then(function(data) {
      res.json(data);
    });
  });

  // POST route for creating a new person
  app.post("/api/people", function(req, res) {
    db.Person.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  // DELETE route for deleting a person
  app.delete("/api/people/:id", function(req, res) {
    db.Person.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // UPDATE route for name
  app.put("/api/people/:id", function(req, res) {
    db.Person.update({
      name: req.body.name
    }, {
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });


};
