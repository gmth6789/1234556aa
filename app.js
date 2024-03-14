let express = require('express')
let dotenv = require('dotenv')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let session = require('express-session');
let flash = require('connect-flash');
let methodOverride = require('method-override')

let app = express()
app.set('view engine', 'ejs')
app.use(express.static(__dirname+'/public/'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))


dotenv.config({path:'./dotenv.env'})

// mongoose connected code
mongoose.connect(process.env.mongoUrl)
.then((x)=>{
    console.log('server Connected')
})
.catch((y)=>{
    console.log('server not connected')
})

app.get('/',(req, res)=>{
  //res.render('index')
  res.send('<a href="/login/">Login</a>')
})




// ALL LOGIN ROUTER HERE
    let loginRouter = require('./login_area/router/login')
    app.use(loginRouter)
//...... end login router here ........







app.use(session({
    secret:'nodejs',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())

//session and flash middle weare
app.use(session({
    secret:'nodejs',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())

// global variable and set message
app.use((req, res, next)=>{
    res.locals.sucess = req.flash('sucess') 
    res.locals.err = req.flash('err')
    //Note: yahan 'sucess' & 'err' globaly message set kiya jaa raha hai jiska use puer application men kahin bhi kiya jaa sakta hai    
   
   
   
    next()
})



app.get('/',(req, res)=>{
    res.send('hello Teach Coderes')
})
let admin = require('./backend/router/admin')
app.use('/admin', admin)
app.listen(process.env.PORT, ()=>{
    console.log(`${process.env.PORT} Port Working`)
})