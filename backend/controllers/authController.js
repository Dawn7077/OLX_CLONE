const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async(req,res,next)=>{
    try {
        const {email,password}= req.body

        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400)
            throw new Error('User already exists')
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            email,
            password:hashedPassword
        })

        let token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})

        if(user){
            res.status(201).json({
                _id:user._id,
                email:user.email,
                token
            })
        }else{
            res.status(400)
            throw new Error('invalid user data')
        }

    } catch (error) {
        next(error)
    }
}


const loginUser = async(req,res,next)=>{
    try {
        const {email,password} =req.body
        const user = await User.findOne({email})
        if (!user) {
            res.status(401)  
            throw new Error('Invalid email or password1')
        }
        let passwordCheck = await bcrypt.compare(password,user.password)
        if(user && passwordCheck){
            res.json({
                _id:user._id,
                email:user.email,
                token:jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
            })
        }else{
            res.status(401)
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {registerUser,loginUser}