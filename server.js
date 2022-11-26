const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./app/models");

var corsOptions = {
    origin: "http://localhost:4200"
};
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

db.sequelize.sync().then(() => {

        console.log('tables created !');
    })
    .catch((err) => {
        console.log(err);
    });

// root
app.get("/", (req, res) => {
    res.status(200);
    res.send("********** Welcome to root URL of Server ********** ");
});
// routes
require('./app/routes/auth.routes')(app);



const PORT = 3000;
app.listen(PORT, (error) => {
        if (!error) {
            console.log("************ Server is Successfully Running and App is listening on port " + PORT + "************")

        } else {
            console.log("Error occurred, server can't start", error);

        }
    }

);