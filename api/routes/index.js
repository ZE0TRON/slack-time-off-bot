const express = require("express");
const handlerController = require("../controllers/handler");
const router = express.Router();
router
  .route("/api")
  // POST /
  .post(handlerController.handleCommand);

module.exports = router;