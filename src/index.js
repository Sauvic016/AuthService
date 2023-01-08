const express = require("express");
const bodyParser = require("body-parser");

const { PORT } = require("./config/serverConfig");

const app = express();

const prepareAndStartServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}`);
  });
};

prepareAndStartServer();
