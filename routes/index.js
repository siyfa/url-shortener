const express = require("express");
const router = express.Router();
const controller = require("../controllers")

//create - short a url
router.post("/encode", controller.encodeUrl);
//decode url
router.post("/decode", controller.decodeUrl);
//visit original url
router.get("/:pathId", controller.redirectUrl);
//statistics url
router.get("/statistics/:pathId", controller.statUrl);

module.exports = router;