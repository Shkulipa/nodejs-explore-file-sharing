const File = require("../models/file");

const downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if(!file) {
            return res.render("download", { error: "Link has been expired" })
        }

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    } catch (err) {
        return res.render("download", { error: "Something went wrong" });
    }
};


module.exports = {
    downloadFile,
}
