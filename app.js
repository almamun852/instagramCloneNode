const { request, response } = require('express')
const express=require('express')
const app=new express()
PORT =5000
const mongoose=require('mongoose')
const {MONGOURI}=require('./keys')
const cors = require('cors')



require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(cors())


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
mongoose.connection.on('connected',()=>{
    console.log('mongo db connected')
})
mongoose.connection.on('error',(err)=>{
    console.log('error occur',err)
})
const customMiddleware=(request,response,next)=>{
    console.log('middleware executed.')
    next()
}
app.use(customMiddleware)
app.get('/',(request,response)=>{
    response.send('hello express.')
})

app.listen(PORT,()=>{
    console.log('App is running',PORT)
})