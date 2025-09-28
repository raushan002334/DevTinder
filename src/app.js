const express = require("express");

const app = express();

const connectDB = require("./config/database");

const User = require("./models/user");

const { adminAuth, userAuth } = require("./middlewares/auth");

/*
app.get("/", (req, res) => {
    res.send("Hello World X MotherFucker!");
});

app.get("/bye", (req, res) => {
    res.send("bye-bye World X  Rott in a hell!");
});

app.get(/.*fly$/, (req, res) => {
    res.send({Name: "Venom", location: "las vegas"});
});

app.post("/user/:userId/:Name/:Password", (req, res) => {
    console.log(req.params);
    res.send("data successfully saved to database");
});

app.delete("/user", (req, res) => {
    res.send("deleted succassfully!");
});
*/

/*
// use of next to get response with the help of middleware

app.use(
    "/user",
    (req, res, next) => {
        console.log("Handling route user!!");
        // res.send("Response!!");
        next();
    },
    (req, res, next) => {
        console.log("Handling route user second!!");
        res.send("Response second!!");
    },
);
we can write above code also like this
app.use(
    "/user",
    (req, res, next) => {
        console.log("Handling route user!!");
        // res.send("Response!!");
        next();
    });
app.use(
    "/user",
    (req, res, next) => {
        console.log("Handling route user second!!");
        res.send("Response second!!");
        next();
    });
*/

/*
// handle Auth middleware for all get,post, delete,...request

app.use("/admin", adminAuth);

app.get("/user/login", (req, res) => {
    res.send("User login successfully!");
});

app.get("/user/data", userAuth, (req, res) => {
    res.send("User data sent!");
});


app.get("/admin/getAllInfo", (req, res) => {
    //logic of checking if the req is auth
    res.send("all data Sent");
});

app.delete("/admin/getAllInfo", (req, res) => {
    //logic of checking if the req is auth
    res.send("deleted succesfully!");
});
*/

/*
// error handling (always use app.use("/") at last)

app.get("/getUserData", (req, res) => {
    //logic for database call and get user data
    // always use try, catch for error
    
    throw new error("efbeuveu");
    res.send("user data Sent");
});

app.use("/", (err, req, res, next) =>{
    if (err) {
        res.status(501).send("something went wrong");
    } 
});
*/

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "rohit",
        lastName: "Kumar",
        email: "raj02334@gmail.com",
        password: "raj123",
        age: 28,
        gender: "male"
    });

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});





connectDB()
    .then(() => {
        console.log("Database connected!");
        app.listen(3000, () => {
            console.log("Example app listening on port 3000!");
        });
    })
    .catch((err) => {
        console.log(err);
        console.log("Database connection failed!");
    });



module.exports = app;
