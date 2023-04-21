const dotenv = require("dotenv");
const server = require("./startup/app")

//db connection
require("./db/index"); 

// configure dotenv
dotenv.config();

const port = process.env.PORT || 8080;

//connect server
server.listen(port, ()=> {
    console.log(`Server is running at PORT ${port}`);
})