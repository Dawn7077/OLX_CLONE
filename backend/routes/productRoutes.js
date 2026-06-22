const express = require('express')
const router = express.Router()
const {createProduct,getProducts,checkoutProducts, getMyProducts, deleteProduct} = require('../controllers/productController')
const multer = require('multer')
const path = require('path')
const {isAuth} =require('../middleware/authMiddleware')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})

router.route('/')
    .get(getProducts)
    .post(isAuth,upload.single('image'),createProduct)

router.get('/my-ads',isAuth,getMyProducts)

router.post('/checkout',isAuth,checkoutProducts)
router.delete('/:id',isAuth,deleteProduct)
module.exports = router