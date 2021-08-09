const router = require("express").Router();
const downloadController = require("../controllers/download");

router
    .get("/:uuid", downloadController.downloadFile);


module.exports = router;
