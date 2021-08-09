require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(
        process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        }
    );

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connected");
    });
}
module.exports = connectDB;
