const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

//MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qspwkqa.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      const db = client.db("belovedMoments");
      const servicesCollection = db.collection("services");
      const reviewsCollection = db.collection("reviews");
      //JWT
      app.post('/jwt', (req, res) =>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d'})
        res.send({token})
    })  
    function verifyJWT(req, res, next){
        const authHeader = req.headers.authorization;
    
        if(!authHeader){
            return res.status(401).send({message: 'Unauthorized access'});
        }
        const token = authHeader.split(' ')[1];
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
            if(err){
                return res.status(403).send({message: 'Forbidden access'});
            }
            req.decoded = decoded;
            next();
        })
    }
    
      //DB
      app.get('/services', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
    });
    app.get('/all/services', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const all_services = await cursor.toArray();
        res.send(all_services);
    });
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.send(service);
    });
    //reviews
    
    
    app.get('/reviews',verifyJWT, async (req, res) => {
        
        let query = {}
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewsCollection.find(query);
        const review = await cursor.toArray();
        res.send(review);
    });
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
    });
    //delete
    app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewsCollection.deleteOne(query);
        res.send(result);
    })
    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const reviewOne = await reviewsCollection.findOne(query);
        res.send(reviewOne);
    });
    
    app.patch("/reviews/:id", async (req, res) => {
        const { id } = req.params;
        
          const result = await reviewsCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });
      
          res.send(result);
      });

    }
    finally{}
}
run().catch(er=>console.log(er));
      

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})