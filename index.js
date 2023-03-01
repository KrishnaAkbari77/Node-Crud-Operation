
const express = require('express');
const app = express();
const port = 7000;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
//to connect with database
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const db = require('./config/mongoose');
0.
const Admintbl = require('./models/adminModels');

// to join page
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.urlencoded());

app.get('/', (req, res) => {
    return res.render('admin');
});

// file upload
const uploads = path.join("uploads"); 

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, uploads);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

const uploadfile = multer({ storage: storage }).single('avatar');

//insert data
app.post('/insertdata', uploadfile, (req, res) => {
    let avatar = "";

    if (req.file) {
        avatar = uploads + "/" + req.file.filename;
    }

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    let hobby = req.body.hobby;
    let city = req.body.city;
    Admintbl.create({
        name: name, 
        email: email,
        password: password,
        gender: gender,
        hobby: hobby,
        city: city,
        avatar: avatar
    }, (err, data) => {
        if (err) {
            console.log("please fill all the field");
            return false;
        }
        console.log("Record successfully insert");
        return res.redirect('/');
    });
});

//view data
app.get('/view', (req, res) => {
    Admintbl.find({}, (err, record) => {
        if (err) {
            console.log("Record not show");
            return false;
        }
        return res.render('view', {
            allrecord: record
        });
    });
});


//delete data
app.get('/deletedata/:id', (req, res) => {
    let deleteid = req.params.id;

    Admintbl.findById(deleteid, (err, data) => {
        if (err) {
            console.log("Record not delete");
            return false;
        }
        if (data.avatar) {
            fs.unlinkSync(data.avatar);
        }
    });

    Admintbl.findByIdAndDelete(deleteid, (err, data) => {
        if (err) {
            console.log("Record not delete");
            return false;
        }
        console.log("Record successfully delete");
        return res.redirect('back');
    });

});

// edit data
app.get('/editdata/:id', (req, res) => {
    let editid = req.params.id;

    Admintbl.findById(editid, (err, editrecord) => {
        if (err) {
            console.log("Edit page didn't open.");
            return false;
        }
        return res.render('edit', {
            editR: editrecord
        })
    })
});

app.post('/updateData',uploadfile,(req,res)=>{
    let id = req.body.id;
    if(req.file)
    {   
        let avatar = "";
        //old file unlink thase
        Admintbl.findById(id,(err,srecord)=>{
            if(err){
                console.log("Record not fetch");
                return false;
            }
            if(srecord.avatar)
            {
                fs.unlinkSync(srecord.avatar);
            }
        })
        avatar = uploads+"/"+req.file.filename;
            Admintbl.findByIdAndUpdate(id,{
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            gender : req.body.gender,
            hobby : req.body.hobby,
            city : req.body.city,
            avatar : avatar
        },(err,data)=>{
            if(err){
                console.log("Record not update");
                return false;
            }
            console.log("Record successfully update");
                return res.redirect('/view');
        });
    }
             
    else{
        Admintbl.findById(id,(err,srecord)=>{
            if(err){
                console.log("Record not fetch");
                return false;
            }
            let avatar = srecord.avatar;
            Admintbl.findByIdAndUpdate(id,{
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                gender : req.body.gender,
                hobby : req.body.hobby,
                city : req.body.city,
                avatar : avatar
            },(err,data)=>{
                if(err){
                    console.log("Record not update");
                    return false;
                }
                console.log("Record successfully update");
                return res.redirect('/view');
            })
        })
    }  
})





// to connnect server
app.listen(port, (err) => {
    if (err) {
        console.log("sever not connected");
        return false;
    }
    console.log("server connected on port 7000");
})