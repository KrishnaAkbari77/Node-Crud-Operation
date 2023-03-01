const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/nodecrud");

const db = mongoose.connection;

db.on('err',console.error.bind(console,"Database not connected"));

db.once('open',(err)=>{
    if(err){
        console.log("Database not started");
        return false;
    }
    console.log("Database started");
})

module.exports = db;