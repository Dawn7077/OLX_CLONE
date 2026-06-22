const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'password must be at least 6 characters']
    },
    
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)