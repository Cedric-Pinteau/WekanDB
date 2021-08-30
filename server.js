// Create a REST API for users with Express.js and Mongoose.js
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

//retrieve the body of the request
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({extended: false}));
app.use(jsonParser);


// Connect to the database
mongoose.connect("mongodb://localhost/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// fix cors issue
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// var snapshotSchema = new mongoose.Schema({
//     boardExport: Object,
//     date: Date
// })

// var Snapshot = mongoose.model("Snapshot", snapshotSchema);

// var boardSchema = new mongoose.Schema({
//     name: String,s
//     snapshots: [Snapshot]
// })

// var Board = mongoose.model("Board", boardSchema);

var userSchema = new mongoose.Schema({
    name: String,
    boards: [{
        name: String,
        snapshots: [{
            boardExport: Object,
            date: Date
        }]
    }]
})

// Create mongoose models
var User = mongoose.model("User", userSchema);




// Define API routes

// Get a specific board from a given user
app.get("/api/user/:username/board/:name", function(req, res) {
    User.findOne({name: req.params.username, "board.name": req.params.name}, function(err, board) {
        if (err){
            res.send(err);
        }
        res.json(board);
    });
});

app.put("/api/user/:username/board/:name/snap", function (req,res) {
    User.find({name: req.params.name}, function(err, board) {
        if (err){
            console.log('User doesn\'t exist');
            res.send(err);
        } else {
            User.findOneAndUpdate(req.body, function(err, user){
                if(err) {
                    res.send(err);
                }
                res.json(user);
            });
        }
    });
});

app.get("/api/board/:name/snap/:date", function(req, res) {
    Snapshot.find(function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    });
});

app.post("/api/board/:name/snap", function (req,res) {
    Snapshot.create(req.body, function(err, user){
        if(err) {
            res.send(err);
        }
        res.json(user);
    });
});












// Define API routes
app.get("/api/user", function(req, res) {
    User.find(function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    });
});

app.post("/api/user", function (req,res) {
    User.create(req.body, function(err, user){
        if(err) {
            res.send(err);
        }
        res.json(user);
    });
});

app.get("/api/user/:id", function(req,res){
    User.findById(req.params.id, function(err, user){
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

app.put("/api/user/:id", function(req,res){
    User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});


app.delete("/api/user/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

// Start the server
app.listen(port, function(){
    console.log(`Server listening on port ${port}`);
});