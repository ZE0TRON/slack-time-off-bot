const express = require("express");
const handlerController = require("../controllers/handler");
const verifier = require("../util/verifier");
const router = express.Router();
router
  .route("/api")
  // POST /
  .post(verifier.verify,handlerController.handleCommand);

module.exports = router;