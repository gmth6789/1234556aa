let express = require('express');
let UserModel = require('../model/model')
let loginRouter = express()
let path = require('path');
loginRouter.set('views', path.join(__dirname, '../views/'))//set cusom view engine folder
let mongoose = require('mongoose'); // use for mongodb 
let session = require('express-session');
let flash = require('connect-flash')
let passport = require('passport'); // passportjs ke stategy hai jisme (face book stategy jo ki facebook se data lo jhaanchene ke liye), (local statey hamaare databse se data ko jhaanchen ke liye) kiyaa jaata hai
let LocalStategy = require('passport-local').Strategy; // local Startegy (database se user ke data ko jhaanchne ke liye kiya jaata hai)
//For forgot Password
let crypto = require('crypto')
let async = require('async')
let nodemailer = require('nodemailer')


//2.  Mongoose Connection
mongoose.connect(process.env.Mongourl).then(()=>{
      console.log('Data Base Connected')
})
.catch(()=>{
      console.log('Data Base Not Connected')
})
//......End Mongoose connection code...... 



  


  




  

//3. Session (for Display Message)
      loginRouter.use(session({
            secret:'loginrajnish',
            resave:true,
            saveUninitialized: true
      }))



  


  




  
   
//4.  Middle weare (Passport, Passport Session, Passport serializeUser, passport deserializeUser)
      loginRouter.use(passport.initialize())
      loginRouter.use(passport.session())
      passport.use(new LocalStategy( {usernameField : 'email'}, UserModel.authenticate())) // yaha local stargey ke middle weare kaa use kiya gaya hai jo ki hamaare data base se data ko find karke jhaanch krene kaa kaam karta hai
      passport.serializeUser(UserModel.serializeUser()) // yah hamaare application(dashboard) login hone  ke baad access karne deta hai
      passport.deserializeUser(UserModel.deserializeUser()) //yah hammare application (dashboard) ko without login ke access hone se rokta hai (matlab ki yah access hone nahin deta hai)



  


  




  

//5.  Set Globaly Variable (like Sucess, err, currentUser)
      loginRouter.use(flash())
      loginRouter.use((req, res, next)=>{
            res.locals.sucess = req.flash('sucess') 
            res.locals.err = req.flash('err')
            res.locals.error = req.flash(('error'))
            res.locals.currentUser =req.user; // for use current user
            /*console.log( res.locals.currentUser)*/
            next()
      })
//......End session code......



  


  




  

//6. START CODE WITHOUT LOGIN NOT ACCESS DASHBOARD Page
      function isAuthenticatedUser(req, res, next) {
            if(req.isAuthenticated()) {
                  return next();
            }
            req.flash('errs', 'Please Login first to access this page.')
            res.redirect('/');
      }



  


  




  

//7. LOGIN loginRouter

      // a. Login Get Code Here
            loginRouter.get('/login', (req, res)=>{
               res.render('login_file')
            })
      //b. Login Post Code Here
            loginRouter.post('/login', passport.authenticate('local', {                 
                  failureRedirect : '/login',
                  failureFlash :'Invaliad User or Password, Try Again' ,
                  successRedirect :'/admin',  
            }))
//......End Login loginRouter......



  


  




  

//8. DISPLAY USER NAME IN DASHBOARD
      // loginRouter.get('/admin', isAuthenticatedUser, (req, res)=>{
      //       res.render('dashboard_file')
      // })

//9. FORGOT PASSWORD 
      // a. Forgot Password get loginRouter
      loginRouter.get('/forgot', (req, res) => {
            res.render('forgot_file')
      })
      // a. Forgot Password get loginRouter
            /* ======= START START USER EMAIL CODE  =======
                        a) ==>  yaha code password ko recovery karne ke user ke email per ak 'url' bhejegaa aur  baad me use 'url'
                              ke help  se ak loginRouter banega jahana user ke password ko lekar use reset kiya jaayegaa

                        b) ==>  BEFOR USE THIS CODE
                              1.  model name = 'UserModel' hai jise aapko ise apne 'UserModel' se change karna hogaa
                              2.  'process.env.Gmail_Email' = men apne mail id set karna hoga
                              3.   'process.env.Gmail_Password' =  men apne mail id kaa pasword set karna hoga
            */
            loginRouter.post('/forgot', (req, res) => {
                  let recoveryPassword = '';
                  //waterfall ak aesa method hai jisme callback function synchronus (matlab ki ak function ke baad dushra function) ki trah kaam karta hai
                  async.waterfall([
                  //generate token
                  (done) => {
                  crypto.randomBytes(30, (err, buf) => {
                        let token = buf.toString('hex');
                        done(err, token);
                  })
                  },
            
                  (token, done) => {
                  // after generate toke search user from database
                  UserModel.findOne({ email: req.body.email })
                              .then((user) => {
                                    if (!user) {
                                    req.flash('err', 'user doen not exist thi  email, please try valid email');
                                    return res.redirect('/forgot')
                                    }
            
            
                                    user.resetPasswordToken = token; //when user exist generate password token
                                    user.resetPasswordExpires = Date.now() + 1800000 ///genterate expiry session for 30 minute expiry
            
                                    user.save(errr => {
                                    done(errr, token, user)
                                    })
                              })
                              .catch(err => {
                                    req.flash('err', 'ERROR :' + err)
                                    res.redirect('/forgot')
                              })
                  }, 
                  // SEND EMAIL
                  (token, user) => {
                        //Simple mail transfer protocpl
                        let smptTransport = nodemailer.createTransport({
                        service: 'Gmail',
                        auth:{
                              user: process.env.Gmail_Email, // kis user se email jaani hai
                              pass: process.env.Gmail_Password  // uska pasword
                        }
                        });
                        // ueser email details
                        let mailOptions ={
                              to:user.email,
                              from: 'Rajnish Bharti rajnishbharti10@gmail.com',
                              subject : 'Recovery Email from Auth Project',
                              text : 'Please Click the following link to  recover your Password : \n\n'+
                              'http://'+req.headers.host+'/reset/'+token+'\n\n'+
                              'if you didn"t request Please Ignore this email'
                        };
                        smptTransport.sendMail(mailOptions, err=>{
                        req.flash('sucess', 'Email Send the futher instructions. Please Cheack Your Email Inbox');
                        res.redirect('/forgot')
                        })
                  }
            
            
                  ], err => {
                  if (err) res.redirect('/forgot')
                  })
            
            })
            // END USER EMAIL CODE 

            
// 10. CREATE ROUTER  ON EMAIL TOKENT LINK
      //a. get Router on Email Token link
            loginRouter.get('/reset/:token', (req, res)=>{
                  UserModel.findOne({resetPasswordToken :req.params.token, resetPasswordExpires :{$gt : Date.now()}})
                  .then((user=>{
                        if(!user){
                              req.flash('err', 'Password reset token in Invalid or has been expire');
                              res.redirect('/forgot')
                        }
                        res.render('reset-password', {token:req.params.token})
                  }))
                  .catch(err=>{
                        req.flash('err', 'Error : '+err);
                        res.redirect('/forgot')
                  })
            })
      
      // get router end code

      //b.  Post router on token link
            loginRouter.post('/reset/:token', (req, res)=>{
                  async.waterfall([
                  (done) => {
                        UserModel.findOne({resetPasswordToken: req.params.token, resetPasswordExpires : {$gt : Date.now() } })
                              .then(user => {
                              if(!user) {
                                    req.flash('error_msg', 'Password reset token in invalid or has been expired.');
                                    res.redirect('/forgot');
                              }
            
                              if(req.body.password !== req.body.confirmpassword) {
                                    req.flash('error_msg', "Password don't match.");
                                    return res.redirect('/forgot');
                              }
            
                              user.setPassword(req.body.password, err => {
                                    user.resetPasswordToken = undefined;
                                    user.resetPasswordExpires = undefined;
            
                                    user.save(err => {
                                          req.logIn(user, err => {
                                          done(err, user);
                                          })
                                    });
                              });
                              })
                              .catch(err => {
                              req.flash('error_msg', 'ERROR: '+err);
                              res.redirect('/forgot');
                              });
                  },
                  (user) => {
                        let smtpTransport = nodemailer.createTransport({
                              service : 'Gmail',
                              auth:{
                              user : process.env.GMAIL_EMAIL,
                              pass : process.env.GMAIL_PASSWORD
                              }
                        });
            
                        let mailOptions = {
                              to : user.email,
                              from : 'Ghulam Abbas myapkforest@gmail.com',
                              subject : 'Your password is changed',
                              text: 'Hello, '+user.name+'\n\n'+
                                    'This is the confirmation that the password for your account '+ user.email+' has been changed.'
                        };
            
                        smtpTransport.sendMail(mailOptions, err=>{
                              req.flash('sucess', 'Your password has been changed successfully.');
                              res.redirect('/login');
                        });
                  }
            
                  ], err => {
                  res.redirect('/login');
                  });
            });
    


  


  




  

//9. SIGNUP loginRouter     

      // a. Get Method here
            loginRouter.get('/signup', (req, res)=>{
               res.render('signup_file')
            })
      // b. Post Method here
            loginRouter.post('/signup/', (req, res) => {
                  let { name, email, password } = req.body
                  var errs
                  if (!name || !email|| !password) {
                  errs = 'you have not all entry Field. Please Fill All Field'
                  res.render('signup_file', {     
                  errs :errs, 
                  registername: name,
                  username:email, 
                  password :password })
                  } else {
                        let userData ={
                              name: name, 
                              email:email
                        };

                              UserModel.register(userData, password, (err,user)=>{
                                    if(err){
                                          req.flash('Error Message ', +errs)
                                          res.redirect('/signup')
                                    }
                                    passport.authenticate('local')(req, res, ()=>{
                                          req.flash('sucess', 'Your Data has created on Database')
                                          res.redirect('/login')
                                    })
                              }) 
                           
                  }
            
            })

//......End SignUp loginRouter......



  


  




  

//9. LOGOUT loginRouter 
      loginRouter.get('/logout',(req, res)=>{
            req.logOut();
            req.flash('sucess', 'Your havebeen Sucessfuly logout')
            res.redirect('/login')
      })
    


  




  

//5. FORGOT PASSWORD loginRouter      
      // a. Get Method here
      loginRouter.get('/forgot', (req, res)=>{
            res.render('forgot_file')
      })
   // b. Post Method here

    


//6. CHANGE PASSWORD loginRouter  

  loginRouter.get('/change-password', isAuthenticatedUser, (req, res)=>{
            res.render('change_file')
             

   })

    loginRouter.post('/change-password', (req, res)=> {

      if(!req.body.password && !req.body.confirmpassword){
        req.flash('err', 'Invaliad Password or confirmpassword. Try Again'); 
         return res.redirect('/change-password');   
      }

    if(req.body.password !== req.body.confirmpassword) {
         req.flash('err', 'Your password & confirmpassword not matched. Please Try Again'); 
         return res.redirect('/change-password');
    }

    UserModel.findOne({email : req.user.email})

        .then(user => {
            user.setPassword(req.body.password, err=>{
                user.save()
                    .then(user => {
                        req.flash('success_msg', 'Password changed successfully.');
                        res.redirect('/login');
                    })
                    .catch(err => {
                        req.flash('Error Message ', +errs)
                        res.redirect('/change-password');
                    });
            });
        });
});


module.exports = loginRouter




