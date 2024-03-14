let express = require('express');
let path = require('path')
let catmodel = require('../model/cat')
let pagemodel = require('../model/pages')
let router = express()


//1. START CODE WITHOUT LOGIN NOT ACCESS DASHBOARD Page
      function isAuthenticatedUser(req, res, next) {
            if(req.isAuthenticated()) {
                  return next();
            }
            req.flash('errs', 'Please Login first to access this page.')
            res.redirect('/');
      }



router.get('/', isAuthenticatedUser, (req, res)=>{
      catmodel.findOne({}).count()
      .then((nocat)=>{
            return pagemodel.find({}).count()
                  .then((noPage)=>{

                        res.render('../backend/views/admin',{nocat, noPage})

                  })
            })
})


 let category = require('../router/category');
 let pages = require('../router/pages')
 router.use('/category/', category);
 router.use('/pages/', pages)

module.exports = router