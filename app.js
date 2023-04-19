const express = require("express");
const dotenv = require("dotenv");

const app = express();

// configure dotenv
dotenv.config();
const port = process.env.PORT || 8080;

//app middleware
app.use(express.json());
//log every request url
app.use((req, res, done) => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    done();
});

//routes
app.use("/", require("./routes"));

//global error handlers
app.use((err, req, res, next) => {
    const errorMessage = err.msg || err.message || "Something went wrong";
    const statusCode = err.code || err.statusCode || 500;

    console.log("err ==> ", new Date(), "<===>", err.service, "<===>", errorMessage);

    return res.status(statusCode).json({message:errorMessage});
});

app.use((req, res, next) => {
    return res.status(404).json({message: "API endpoint not found"})
});

//connect server
app.listen(port, async ()=> {
    //db connection
    require("./db/index");
    console.log(`Server is running at PORT ${port}`);
})