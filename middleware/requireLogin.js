const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require("../keys")
const mongoose=require('mongoose')
const User=mongoose.model("User")
module.exports=(request,response,next)=>{
    const {authorization}=request.headers
    if(!authorization){
       return response.status(401).json({error:"You must be login first."})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return response.status(401).json({error:"You must be login first."})
        }
        const {_id}=payload
        User.findById(_id).then(userData=>{
            request.user=userData
            next()
        })
        
    })
}