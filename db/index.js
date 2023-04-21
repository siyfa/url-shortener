const mongoose = require("mongoose");
const dotenv = require("dotenv");

// configure dotenv
dotenv.config();

//mongodb connnection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`MongoDB is Connected`);
    })
    .catch(err => {
        console.log(err.message);
        process.exit(1)
    });