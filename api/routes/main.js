const express = require("express");
const handlerController = require("../controllers/handler");
const router = express.Router();
router
  .route("/")
  // POST /
  .post(handlerController.handleCommand);