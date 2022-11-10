const express = require('express');
const cors = require('cors');
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
    app.get('/reviews', async (req, res) => {
        const query = {};
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
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