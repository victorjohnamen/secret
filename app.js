require('dotenv').config();


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email:{type:String, required:true},
  password:{type:String, required:true}
});
//encryption of password



const User = new mongoose.model("User",userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",function(req,res){
  res.render("home");
});
//////////////////////////// Login a USER /////////////////////////////////////
app.route("/login")
.get(function(req,res){
  res.render("login");
})

.post(function(req,res){
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({email:username},function(err,result){
    if(err){ //checking if theres error in finding the user
      console.log(err);
    }else{   //if no errors in finding the user
      if(result){       //check if theres a result
        bcrypt.compare(password,result.password,function(err,result){
          if(result === true){
            res.render("secrets");
          }else{
            console.log("password does not match");
          }
        });
      }else{       //condition if no users found
        console.log("No data found");
      }
    }
  });
});
/////////////////////////// REGISTER A USER ////////////////////////////////////
app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err, hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){ //save the new user
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });

  });


});

app.listen(3000,function(req,res){
  console.log("server starting");
});
