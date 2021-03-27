const winston = require("winston");
const express = require("express");
const app = express();
require("express-async-errors");

require("./startup/logging")();
require("./startup/db")();
require("./startup/joiValidation")();
require("./startup/routes")(app);

const port = process.env.PORT || 3900;
app.listen(port, () => winston.info(`Listenig on port ${port}...`));
