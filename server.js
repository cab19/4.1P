const express = require('express');
const bodyParser = require('body-parser');
const validator = require("validator");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/iCrowdTask", {useNewUrlParser:true});
const Requester = require("./models/Requester");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
})

app.post('/', (req,res)=>{
    //console.log("POSTED "+req.body.country);
    let error = false;

    // ensure passwords match
    let password = req.body.password;
    if(password != req.body.passwordRepeat){
        password = "";
        error = true;
        console.log('Passwords dont match!');
    }
    
    // ensure country is not default option
    let country = req.body.country;
    if(country === "Country of residence *"){
        country = "";
        error = true;
        console.log('Country of residence not entered!');
    }

    if(!error){ // if above is okay process form
        const requester = new Requester(
            {
                country : country,
                fName : req.body.fName,
                lName : req.body.lName,
                email : req.body.email,
                password : password,
                address : req.body.address,
                city : req.body.city,
                state : req.body.state,
                postCode : req.body.postCode,
                mobileNumber : req.body.mobileNumber,
            }
        )

        requester.save((err) =>{ 
            if (err){
                res.sendFile(__dirname + "/public/error.html");
                console.log(err);
                
            }
            else{
                console.log("Success!");
                res.sendFile(__dirname + "/public/success.html");
            }
        });
    }
    else
        res.sendFile(__dirname + "/public/error.html");
});

app.listen(8080, function (request, response){
    console.log("Server is running on 8080");
})