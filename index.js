require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
const fs = require("fs");

const multer = require('multer');
const { addNewUser } = require('./controllers/usersContoller');

app.use(cors())
app.use(express.static('static'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

mongoose.connect(process.env.MONGODB_ATLAS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'static/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const multipart = multer({ storage: storage })

app.post('/submit', multipart.single('uploadFile'), async(req, res) => {
  let newFile = null

    if (req.file) {
      let file = fs.readFileSync(req.file.path);
      let encode_file = file.toString('base64');
      newFile = {
          contentType:req.file.mimetype,
          data: new Buffer.from(encode_file,'base64')
      };
    }

    let newUser = await addNewUser({
      name: req.body.firstName + ' ' + req.body.lastName, 
      email: req.body.email, 
      address: req.body.address, 
      file: newFile, 
      fileName: newFile ? req.file.originalname : null
    })
    if (newUser.status) {
        res.send(newUser.result)
    } else {
      console.log(newUser.result)
        res.status(400).send(newUser.result)
    }
})


app.all(/.*/, (req, res) => {
  res.statusCode = (404)
  res.send('Invalid Endpoint.')
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is listening at port number : ${PORT}`);
})