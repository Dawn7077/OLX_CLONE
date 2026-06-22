const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const{errorHandler} = require('./middleware/errorMiddleware')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)

app.use((req,res,next)=>{
    res.status(404)
    next(new Error(`Not found - ${req.originalUrl}`))
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server running on port:${PORT} \n  http://localhost:${PORT}/`))