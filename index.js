const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT|| 5000;
const app = express();
app.get('/',(req,res)=>{
    res.send('Server running');
});
app.listen(port,()=>{
    console.log('Server running on port',port);
});