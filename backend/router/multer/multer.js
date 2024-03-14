

let multer = require('multer');
//IMAGE NAME SETTING
let storage = multer.diskStorage({
    destination: 'public/backend/assets/images/upload', //CHANGE FOLDE AS YOUR REQUIRMENT
    filename: (req, file, cb) => {
        //cb(null, Date.now() + file.originalname) // file name setting with current –date
	cb(null ,  file.originalname) // file name setting with original name
    }
})

//IMAGE UPLOAD SETTING
let upload = multer({
    storage: storage,
    // here image validation
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
            cb(null, true)
        }
        else {
            cb(null, false)
            return cb(new Error('Only Jpg, png, jpeg, allow'))
        }
    }})  
module.exports = upload

