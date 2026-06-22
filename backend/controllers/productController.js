const { set } = require('mongoose')
const Product = require('../models/Product')

const createProduct = async(req,res,next)=>{
    try {
        const {title,description,price,category}= req.body
        let imageUrl =''

        if(req.file){
            imageUrl = `http://localhost:3000/uploads/${req.file.filename}`
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            imageUrl,
            seller:req.user._id
        }) 

        const productCreated = await product.save()
        res.status(201).json(productCreated)

    } catch (error) {
        next(error)
    }
}


const getProducts = async(req,res,next)=>{
    try {
        let query = {isSold :false}
        if(req.query.category){
            query.category = req.query.category
        }
        if(req.query.maxPrice){
            query.maxPrice = {$lte:Number(req.query.maxPrice)}
        }

        const products = await Product.find(query).populate('seller','email').sort({createdAt:-1})
        res.json(products)
    } catch (error) {
        next(error)
    }
}

const checkoutProducts = async(req,res,next)=>{
    try {
        const {productIds} = req.body
        if(!productIds || !Array.isArray(productIds) || productIds.length===0){
            res.status(400)
            throw new Error('Please provide an array of product Ids to checkout')
        }

        const result = await Product.updateMany(
            {_id:{$in:productIds},isSold:false},
            {$set :{isSold:true}}
        )

        res.json({
            message:'checkout successful',
            modifiedCount:result.modifiedCount
        })
    } catch (error) {
        next(error)
    }
}

const getMyProducts = async(req,res,next)=>{
    try {
        const products = await Product.find({seller:req.user._id}).sort({createdAt:-1})

        res.json(products)
    } catch (error) {
        next(error)
    }
} 

const deleteProduct =async(req,res,next)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }

        if(product.seller.toString() !== req.user._id.toString()){
            res.status(401);
            throw new Error('User not authorized to delete this advertisement');
        }
        console.log('deleting...\n',product)

        await product.deleteOne()

        res.json({id:req.params.id,message:'Ad was removed successfully'})
    } catch (error) {
        next(error)
    }
}

module.exports = {createProduct,getProducts,checkoutProducts,getMyProducts,deleteProduct}