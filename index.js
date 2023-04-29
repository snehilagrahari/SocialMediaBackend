const express = require('express')
const cors = require('cors');
const { mongoConnect } = require('./config/db');
const { apiRouter } = require('./routes/api.route');

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.listen(process.env.PORT,async ()=>{
    try{
        await mongoConnect;
        console.log('DB Connected');
    }
    catch(err){
        console.log('Error connecting DB')
    }
    console.log(`Running Server on PORT:${process.env.PORT}`)
})