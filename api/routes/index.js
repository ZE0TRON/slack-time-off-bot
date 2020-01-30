const express = require("express");
const handlerController = require("../controllers/handler");
const verifier = require("../util/verifier");
const router = express.Router();

router
  .route("/api/interactivity")
  // POST /
  .post(handlerController.handlePayload);
router
  .route("/api/commands")
  // POST /
  .post(verifier.verify,handlerController.handleCommand);

module.exports = router;