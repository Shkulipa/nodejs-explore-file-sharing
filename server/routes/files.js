const router = require("express").Router();
const filesController = require("../controllers/files");

router
    .post("/", filesController.postFile)
    .post("/send", filesController.sendMailReq)

module.exports = router;
