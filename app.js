const express = require('express');
const mongoose = require('mongoose');
const app = express();
const auth = require('./routes/auth');
const cors = require('cors');
require('dotenv/config');
 

// DB connection
mongoose.connect(process.env.DB_CONNECT, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Finally connected');
},
    err => console.log(err)
)

// Middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// app.use(cors)


// Routes
app.use('/api/auth', auth)
app.get('/', (req, res) => {
    res.send('E don connect?')
})


// Server
app.listen('3000')
