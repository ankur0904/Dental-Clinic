const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", "ejs");
// using the body parser
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://<name>:<password>@clustor0.xrenqux.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

const patientSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    contactNumber: String,
    age: Number,
    gender: String,
    examineDate: Date,
    nextVisitDate: Date,
    diagnosis: String,
});

const Patient = mongoose.model("Patient", patientSchema);

app.get("/", function (req, res) {
    // res.sendFile(__dirname+"/index.html")
    res.render("index");
});

app.get("/book-appointment", function (req, res) {
    // res.sendFile(__dirname+"/appointment.html")
    res.render("appointment");
});



app.get("/:customListName", function (req, res) {
    let customRequest = req.params.customListName;
    let serviceData = customRequest;
    res.render(customRequest, { services: serviceData });
});

app.get("/appointment", function (req, res) {
    res.render("login");
});

app.post("/appointment", function (req, res) {

    let condition = "Registered";
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "Email1",
            pass: "password"
        }
    });

    let mail1 = {
        from: 'Email1',
        to: req.body.email,
        subject: 'Successfully booked your appointment',
        text: "Dear Sir/Madam, thank you for booking appointment with us. Scheduled will be shared with you soon. For other query call plese call at 123456789"
    };

    transporter.sendMail(mail1, function (error) {
        if (error) {
            console.log(error);
        }
    });

    let mail2 = {
        from: 'Email1',
        to: 'Email2',
        subject: 'Appointment request',
        text: "Dear Sir/Madam, there is an appointment booking with name " + req.body.name + " with location " + req.body.location + "."
    };

    transporter.sendMail(mail2, function (error) {
        if (error) {
            console.log(error);
        }else{
            res.render("success", { condition: condition })
        }
    });
});


// login for the admin only
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: "Ankur" }, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("admin")
                    }
                });
            }
        }
    });
});


// This is only for the production purpose 
// This is only for the production purpose 
// This is only for the production purpose 
// app.get("/register-user", function (req, res) {
    // res.render("register-user")
// });

// app.post("/register-user", function (req, res) {
    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // const newUser = new User({
            // email: req.body.username,
            // password: hash
        // });
        // newUser.save(function (err) {
            // if (err) {
                // console.log(err)
            // }
        // });
    // });
// });

app.post("/addNewPatient", function (req, res) {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const contactNumber = req.body.number;
    const age = req.body.age;
    const gender = req.body.gender;
    const examineDate = req.body.eDate;
    const nextVisitDate = req.body.nDate;
    const diagnosis = req.body.diagnosis;

    const newPatient = new Patient({
        fName: fName,
        lName: lName,
        contactNumber: contactNumber,
        age: age,
        gender: gender,
        examineDate: examineDate,
        nextVisitDate: nextVisitDate,
        diagnosis: diagnosis
    })

    newPatient.save(function (err) {
        conditionNow = "Saved data"
        if (err) {
            console.log(err);
        }
        else {
            res.render("success", { condition: conditionNow });
        }
    })
})

app.post("/add", function (req, res) {
    res.render("admin/add");
})


app.post("/search", function (req, res) {
    const query = req.body.searchQuery;
    Patient.find({ contactNumber: query }, function (err, patientData) {
        res.render("admin/search", { patientDataAll: patientData });
    });

})

app.post("/delete", function (req, res) {
    const query = req.body.searchQuery;
    Patient.deleteMany({ contactNumber: query }, function (err) {
        condition = "Deleted"
        console.log(err);
        res.render("success", { condition: condition })
    });
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server started successfully");
});