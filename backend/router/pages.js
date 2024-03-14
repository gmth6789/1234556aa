let express = require('express');
let catmodel = require('../model/cat')
let pagemodel = require('../model/pages')
let path = require('path');
const upload = require('./multer/multer');
let router = express()

//cheack on this url : http://localhost:200/admin/pages/viewdata
router.get('/viewdata', (req, res)=>{
    pagemodel.find({}).populate('categoryId')
    .then((x)=>{
        res.send(x)
    })
})
router.get('/', (req, res)=>{
    catmodel.find({})
    .then((catdata)=>{
        return pagemodel.find({})
        .then((x)=>{
            res.render('../backend/views/pages', {x, catdata})   
        })
        .catch((y)=>{
            console.log(y)
        })
    })
})

router.get('/add/:id', (req, res)=>{
    catmodel.findOne({url:req.params.id})
    .then((x)=>{
        res.render('../backend/views/pages-add', {x}) 
    })
    .catch((y)=>{
        console.log(y)
    })
      
})

router.post('/add/:id', upload.single('Page_Photo'), (req, res)=>{
     catmodel.findOne({url :req.params.id})
     .then((x)=>{
        return pagemodel.findOne({pageUrl : req.body.Page_Url})
            .then((a)=>{

                if(a){
                    req.flash('err', 'Your Data has already on database, Please use another url')
                    res.redirect('/admin/pages')
                }
                else{
                    if(!req.file){
                        pagemodel.create({
                            categoryId:x._id,
                            pageUrl : req.body.Page_Url,
                            pageMetaDescription:req.body.Page_Meta_Description,
                            pageMetaKeyword:req.body.Page_Meta_Keyword,
                            pageH1 :req.body.Page_Heading,
                            //pagePhoto:req.file.filename,
                            pageVideo:req.body.you_tube,
                            pageDetails:req.body.Page_Details
                        })
                        .then((x)=>{
                            req.flash('sucess', 'Your Data has been updated on Data base')
                            res.redirect('/admin/pages/')
                        })
                        .catch((y)=>{
                            console.log(y)
                        })  
                    }
                    else{
                        pagemodel.create({
                            categoryId:x._id,
                            pageUrl : req.body.Page_Url,
                            pageMetaDescription:req.body.Page_Meta_Description,
                            pageMetaKeyword:req.body.Page_Meta_Keyword,
                            pageH1 :req.body.Page_Heading,
                            pagePhoto:req.file.filename,
                            pageVideo:req.body.you_tube,
                            pageDetails:req.body.Page_Details
                          })
                          .then((x)=>{
                            req.flash('sucess', 'Your Data has been updated on Data base')
                            res.redirect('/admin/pages/')
                          })
                          .catch((y)=>{
                              console.log(y)
                          })
                    }
            }
        })
    }) 
})


router.get('/edit/:id', (req, res)=>{

    pagemodel.findOne({_id:req.params.id})
    .then((x)=>{
        res.render('../backend/views/pages-edit', {x})
        console.log(x)
    })
    .catch((y)=>{
        console.log(y)
    })
  
   })

   router.put('/edit/:id',  upload.single('Page_Photo'), (req, res)=>{
    if(!req.file){
        pagemodel.updateOne({_id:req.params.id}, {$set:{
            //categoryId:req.params.Cat_Id,
            pageUrl : req.body.Page_Url,
            pageMetaDescription:req.body.Page_Meta_Description,
            pageMetaKeyword:req.body.Page_Meta_Keyword,
            pageH1 :req.body.Page_Heading,
            //pagePhoto:req.file.filename,
            pageVideo:req.body.you_tube,
            pageDetails:req.body.Page_Details
        }})
        .then((x)=>{
            req.flash('sucess', 'Your Data has been updated on Data base')
           res.redirect('/admin/pages/')
          }).catch((y)=>{
              console.log(y)
          })  
    }
    else{
        pagemodel.updateOne({_id:req.params.id}, {$set:{
            //categoryId:[req.params.Cat_Id],
            pageUrl : req.body.Page_Url,
            pageMetaDescription:req.body.Page_Meta_Description,
            pageMetaKeyword:req.body.Page_Meta_Keyword,
            pageH1 :req.body.Page_Heading,
            pagePhoto:req.file.filename,
            pageVideo:req.body.you_tube,
            pageDetails:req.body.Page_Details
          }})
          .then((x)=>{
            req.flash('sucess', 'Your Data has been updated on Data base')
            res.redirect('/admin/pages/')
          }).catch((y)=>{
              console.log(y)
          })
    }
   

  
   })

   router.delete('/delete/:id', (req, res)=>{
    pagemodel.deleteOne({_id:req.params.id})
    .then((x)=>{
        req.flash('sucess', 'Your Data has been deleated on Data base')
        res.redirect('/admin/pages/')
    })
    .catch((y)=>{
        console.log(y)
    })
  
   })
   



module.exports = router