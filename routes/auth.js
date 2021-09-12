
const express=require('express')
const router=express.Router()

const mongoose=require('mongoose')
const User=mongoose.model("User")

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')

const requireLogin = require('../middleware/requireLogin')


router.get("/protected",requireLogin,(resquest,response)=>{
    response.send("middleware works perfectly.")
})

router.get('/',(resquest,response)=>{
    response.send("hello")
})

router.post('/signup',(request,response)=>{
const {name,email,password}=request.body
if(!name || !email || !password){
   return response.status(422).json({error:'Please add all the fields'})
}
// else{
//    return  response.json({message:'successfully posted.'})
// }

User.findOne({email:email})
 .then((savedUser)=>{
     if(savedUser){
         return response.status(422).json({error:'User email already exists.'})
     }

     bcrypt.hash(password,12)
      .then(hashedPassword=>{
        const user=new User({
            email,
            password:hashedPassword,
            name
        })

        user.save()
        .then(user=>{
            response.json({message:"Saved Successfully."})
        })
        .catch(error=>{
            console.log(error)
        })
      })
     
     
 })
 .catch(error=>{
     console.log(error)
})

// console.log(request.body)
})


router.post('/signin',(request,response)=>{
    const {email,password}=request.body
    if( !email || !password){
        return response.status(422).json({error:'Please fill all the fields'})
     }
    User.findOne({email:email})
     .then((savedUser)=>{
         if(!savedUser){
             return response.status(422).json({error:'Invalid Username or Password'})
         }
    
         bcrypt.compare(password,savedUser.password)
          .then(doMatch=>{
            if(doMatch){
                // return response.json({message:'Successfully Login'})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email}=savedUser
                return response.json({token:token,user:{_id,name,email}})
            }
            else{
                return response.status(422).json({error:'Invalid Username or Password.'})
            }
          })
          .catch(error=>{
              console.log(error)
          })  
     })
     .catch(error=>{console.log(error)})
    })

module.exports=router