const express = require('express');
const app = express();

console.log('Starting backend server...');

require('dotenv').config();
app.use(express.json());
console.log('Express JSON middleware loaded');

const fileuploading = require('express-fileupload');
app.use(
  fileuploading({
    useTempFiles: true,
    tempFileDir: '/tmp'
  })
);
console.log('File upload middleware loaded');

const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
console.log('Cookie parser middleware loaded');

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
console.log('CORS middleware loaded');

const router = require('./routes/route');
app.use('/api/v1', router);
console.log('API routes mounted');

const dbConnect = require('./config/database');
dbConnect();

const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('<h1>Shppoing App Backend</h1>');
});

app.listen(process.env.PORT, () => {
  console.log('App Running on port:', process.env.PORT);
});
