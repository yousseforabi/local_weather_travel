const express = require("express");
const cors = require("cors");
const app = express();

const corsOption = {
    origin:["http://localhost:5173"]
};

app.use (cors(corsOption));

{/* logic  */}

app.listen(8080,() => {
    console.log("server running on port 8080")
})