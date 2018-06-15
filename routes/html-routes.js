// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

module.exports = function(app) {

  // takes you to the main page
  app.get("/index", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

};
