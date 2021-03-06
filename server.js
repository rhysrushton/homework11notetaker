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

//API Post 
noteApp.post("/api/notes", function(req,res){
    var note =req.body;
    fs.readFile("./db/db.json", function (error,data){
        if(error){
            return console.log(error);
        }
        var newNotes = JSON.parse(data);
        if(newNotes[newNotes.length - 1]){
            note.id= newNotes[newNotes.length - 1].id+1;
        } else{
            note.id=1; 
        }
        newNotes.push(note);
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (error){
            if (error) {
                throw (error)
            } res.json(note)
        })
    })
    
})

//Get
noteApp.get("/api/notes", function(req, res){
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if(err){
            throw(err)
        } return res.json(JSON.parse(data))
    })

}); 


//Delete Function 
noteApp.delete("/api/notes/:id", function(req,res){
    var id = parseInt(req.params.id);
    fs.readFile("./db/db.json", "utf8", function(error, data){
        if(error) {
            return console.log(error); 
        }
        var allNotes = JSON.parse(data);
        var noteSearch = allNotes.find((element) => element.id === id);
        console.log(noteSearch);
        allNotes.splice(allNotes.indexOf(noteSearch), 1);
        fs.writeFile("./db/db.json", JSON.stringify(allNotes), function (error){
            if(error){
                return(error)
            } res.json(allNotes)
            console.log("done"); 
        })
    })
  
})


//Listen
noteApp.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
  });