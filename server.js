const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
});
