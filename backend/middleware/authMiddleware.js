const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isAuth = async (req,res,next) => {
    let token= req.headers.authorization
    if(token && token.startsWith('Bearer')){
        try {
            token = token.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id)

            if(!req.user){
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next()
        } catch (error) {
            res.status(401).json({message:'Invalid pass/token'})
        }
    }else{
        res.status(401).json({message:'No pass/token provided'})
    }
}

module.exports = {isAuth}