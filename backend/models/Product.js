const  {mongoose} = require('mongoose')
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Product title is required']
    },
    description:{
        type:String,
        required:[true,'Description is required']
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
        min:[0,'Price must be Positive']
    },
    category:{
        type:String,
        required:[true,'Category is required']
    },
    imageUrl:{
        type:String,
        required:[true,'Product image is required']
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' // points to user collection and populates
    },
    isSold:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})

module.exports = mongoose.model('Product',productSchema)