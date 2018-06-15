const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");


// Require all models
const db = require("./models");
const PORT = process.env.PORT || 8080;
// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

require("./routes/html-routes.js")(app);
require("./routes/people-routes.js")(app);
require("./routes/number-routes.js")(app);



// Syncing sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
