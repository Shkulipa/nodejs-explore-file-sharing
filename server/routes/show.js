const router = require("express").Router();
const showController = require("../controllers/show");

router
    .get("/:uuid", showController.showFile);


module.exports = router;
