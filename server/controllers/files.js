const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require('uuid');

//sendMail
const sendMail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit: {fileSize: 1000000 * 100},
}).single("myFile");

const postFile = async (req, res) => {
    try {
        //Store file
        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ error: err.message });
            }
            const file = new File({
                filename: req.file.filename,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size
            });
            const response = await file.save();
            res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        });
    } catch (err) {
        console.error(err.message);
    }
};

const sendMailReq = async (req, res) => {
    try {
       const { uuid, emailTo, emailFrom } = req.body;

        //validate
        if(!uuid || !emailTo || !emailFrom) {
            return res.status(422).send({ error: "All fields are required." });
        }

        //check in DB
        const file = await File.findOne({ uuid });

        if(file.sender) {
            return res.status(422).send({ error: "Email already sent." });
        }

        file.sender = emailFrom;
        file.receiver = emailTo;
        await file.save();

        //send mail
        await sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "inShare file sharing",
            text: `${emailFrom} shared a file with you.`,
            html: emailTemplate({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size/1000) + " KB",
                expires: "24 hours"
            })
        })

        return res.send({success: true})

    } catch (err) {
        console.error(err.message);
    }
};


module.exports = {
    postFile,
    sendMailReq
}
