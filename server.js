var fs = require("fs"); 
var path = require("path"); 
var express = require("express");
var noteApp = express();

noteApp.use(express.static("public"));
noteApp.use(express.static("db")); 

var PORT = process.env.PORT || 3000; 

noteApp.use(express.urlencoded({ extended: true }));
noteApp.use(express.json());

//HTML Route for Main Page
noteApp.get("/", function (req, res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
}); 

//HTML Route for Note Page
noteApp.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html")); 
}); 

//API Get Function to DB JSON
noteApp.get("/api/notes", function (req, res){
    fs.readFile("./db/db.json", "utf8", function (error, data){
        if (error){
            return console.log(error);
        }
        return res.json(JSON.parse(data));
    });
}); 



//Listen
noteApp.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
  });