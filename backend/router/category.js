let express = require('express');
let catmodel = require('../model/cat')
let path = require('path');
const upload = require('./multer/multer');
let router = express()

router.get('/', (req, res)=>{
    catmodel.find({})
    .then((x)=>{
   
        res.render('../backend/views/category', {x})
   
   
    })
    .catch((y)=>{
        console.log(y)
    })
 
})

router.post('/', upload.single('Cat_Photo'), (req, res)=>{
    catmodel.findOne({url : req.body.Cat_Url})
    .then((a)=>{
        if(a){
            req.flash('err', 'Your Data has already on database, Please use another url')
            res.redirect('/admin/category')
        }
        else{
            if(!req.file){
                catmodel.create({
                    url : req.body.Cat_Url,
                    metaDescription:req.body.Cat_Meta_Description,
                    metaKeyword:req.body.Cat_Meta_Keyword,
                    h1 :req.body.Cat_Heading,
                    //photo:req.file.filename,
                    categoryDetails:req.body.Cat_Details
                  })
                  .then((x)=>{
                    req.flash('sucess', 'Your Data has been created on Data base')
                   res.redirect('/admin/category/')
                  }).catch((y)=>{
                      console.log(y)
                  })   
            }
            else{  
                catmodel.create({
                url : req.body.Cat_Url,
                metaDescription:req.body.Cat_Meta_Description,
                metaKeyword:req.body.Cat_Meta_Keyword,
                h1 :req.body.Cat_Heading,
                photo:req.file.filename,
                categoryDetails:req.body.Cat_Details
              })
              .then((x)=>{
                req.flash('sucess', 'Your Data has been created on Data base')
                res.redirect('/admin/category/')
              }).catch((y)=>{
                  console.log(y)
              })  
        
            }
        }
    })
 
})
router.get('/edit/:id', (req, res)=>{
    catmodel.findOne({_id:req.params.id})
    .then((x)=>{
        res.render('../backend/views/category-edit', {x})
    })
    .catch((y)=>{
        console.log(y)
    })
  
   })

   router.put('/edit/:id',  upload.single('Cat_Photo'), (req, res)=>{
    if(!req.file){
        catmodel.updateOne({_id:req.params.id}, {$set:{
            url : req.body.Cat_Url,
            metaDescription:req.body.Cat_Meta_Description,
            metaKeyword:req.body.Cat_Meta_Keyword,
            h1 :req.body.Cat_Heading,
            //photo:req.file.filename,
            categoryDetails:req.body.Cat_Details
        }})
        .then((x)=>{
            req.flash('sucess', 'Your Data has been updated on Data base')
           res.redirect('/admin/category/')
          }).catch((y)=>{
              console.log(y)
          })  
    }
    else{
        catmodel.updateOne({_id:req.params.id}, {$set:{ 
            url : req.body.Cat_Url,
            metaDescription:req.body.Cat_Meta_Description,
            metaKeyword:req.body.Cat_Meta_Keyword,
            h1 :req.body.Cat_Heading,
            photo:req.file.filename,
            categoryDetails:req.body.Cat_Details
          }})
          .then((x)=>{
            req.flash('sucess', 'Your Data has been updated on Data base')
           res.redirect('/admin/category/')
          }).catch((y)=>{
              console.log(y)
          })
    }
   

  
   })

   router.delete('/delete/:id', (req, res)=>{
    catmodel.deleteOne({_id:req.params.id})
    .then((x)=>{
        req.flash('sucess', 'Your Data has been deleated on Data base')
        res.redirect('/admin/category/')
    })
    .catch((y)=>{
        console.log(y)
    })
  
   })
   



module.exports = router