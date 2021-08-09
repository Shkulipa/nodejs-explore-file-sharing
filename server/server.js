require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.static('public'));
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_CLIENTS.split(","),
    methods: "GET,POST",
    optionsSuccessStatus: 200,
}))

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

const connectDB = require("./config/db");
connectDB();

//Routers
const files = require("./routes/files");
const show = require('./routes/show');
const download = require('./routes/download');
app.use("/api/files", files);
app.use('/files', show);
app.use('/files/download', download);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
})
