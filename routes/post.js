const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const Post =mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts',requireLogin,(request,response)=>{
    Post.find()
    .populate("postedBy","_id name")
     .then(posts=>{
         return response.json({posts})
     })
     .catch(error=>{console.log(error)})
})
router.get('/mypost',requireLogin,(request,response)=>{
    Post.find({postedBy:request.user._id})
    .populate("postedBy","_id name")
     .then(posts=>{
         return response.json({posts})
     })
     .catch(error=>{console.log(error)})
})

router.post('/createpost',requireLogin,(request,response)=>{
    const {title,body}=request.body
    if(!title || !body){
        return response.status(422).json({error:"Please add all the fields"})
    }
    request.user.password=undefined
    const post=new Post({
        title,
        body,
        postedBy:request.user
    })

    post.save().then(result=>{
      return  response.json({post:result})
    })
    .catch(error=>{console.log(error)})


    // console.log(request.user)
    // response.send("okay")
})

module.exports=router