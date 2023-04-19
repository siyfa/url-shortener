const express = require("express");
const router = express.Router();
const controller = require("../controllers")

//create - short a url
router.post("/encode", controller.shortUrl);

module.exports = router;